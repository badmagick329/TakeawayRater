from django.core.validators import URLValidator, ValidationError

from .models import Food, Order, Rating, Restaurant, Tag, User


def validate(data, user):
    """
    data is assumed to be a dict containing the order data
    entered so far. Errors are returned as a dict of field names and
    error messages. Data about fields that should be autofilled is
    returned in the same format as the data dict,
    but only for fields that should be autofilled. if no prefill data
    is required, an empty dict is returned.

    Sample:
    {
        "restaurant": "McDonalds",
        "url": "https://www.mcdonalds.com",
        "foods": [
            {
                "name": "Big Mac",
                "rating": 3,
                "image": Uploaded Image File, (optional)
                "image_url": "https://image.jpg", (optional)
                "tags": ["burger", "beef"],
                "comment": "It was ok",
            },
            ...
        ]
    }

    :param data: dict of order data
    :param prefill: bool, whether to return prefill data
    """

    # Validate restaurant
    being_edited = data.get("id", None)
    data = clean_order_data(data, clean_only=True)["data"]
    restaurant_name = data["restaurant"]
    saved_r = Restaurant.objects.filter(name=restaurant_name).first()

    # Check that the url is not in use by another restaurant unless the order is being edited
    r = Restaurant(
        name=restaurant_name,
        url=data["url"],
    )
    if not being_edited:
        try:
            r.clean()
            if saved_r and r.url == "":
                return {"url": saved_r.url}

        except ValidationError as e:
            return {"errors": {"url": e.messages}}

    # Validate URL
    if r.url != "":
        try:
            URLValidator()(r.url)
        except ValidationError as e:
            return {"errors": {"url": e.messages}}

    # Get prefill data for existing foods if restaurant found in db
    if not saved_r:
        return {}

    foods = data["foods"]
    foods_list = []

    for food in foods:
        food_dict = {"name": food["name"]}
        f = Food.objects.filter(name=food_dict["name"], restaurant=saved_r)
        if f:
            f = f.first()
            rating = Rating.objects.filter(food=f, user=user).first()
            food_dict["rating"] = rating.rating
            food_dict["tags"] = [t.name for t in f.tags.all()]
            if f.image:
                food_dict["image"] = f.image.url
        foods_list.append(food_dict)
    return {"foods": foods_list}


def clean_order_data(data, clean_only=False) -> dict:
    """
    Return cleaned order data. If clean_only is False then validation is also
    performed. If validation fails, the returned dict contains an "errors" key
    with a dict of field names and error messages. If validation succeeds, the
    returned dict contains a "data" key with the cleaned data.
    """
    errors = {}
    foods = list_from_form_data(data)
    restaurant_clean = data["restaurant"].strip()
    url_clean = data["url"].strip()

    foods_clean = []
    for food in foods:
        food_clean = {
            "id": food["id"],
            "name": food["name"].strip(),
            "rating": food["rating"],
            "image": food["image"],
            "image_url": food["image_url"].strip()
            if food["image_url"]
            else None,
            "tags": [t.strip().lower() for t in food["tags"] if t.strip()],
            "comment": food.get("comment", "").strip(),
        }
        foods_clean.append(food_clean)

    clean_data = {
        "id": data.get("id", None),
        "restaurant": restaurant_clean,
        "url": url_clean,
        "foods": foods_clean,
    }

    if not clean_only:
        # Required Field Validation
        if clean_data["restaurant"] == "":
            errors["restaurant"] = "Restaurant name is required"

        errors["foods"] = [None for f in foods]
        for i, food in enumerate(foods):
            if food["name"] == "":
                errors["foods"][i] = "Food name is required"
            elif food["rating"] == 0:
                errors["foods"][i] = "Food rating is required"
        if all([e is None for e in errors["foods"]]):
            errors.pop("foods")

        if errors:
            return {"errors": errors}

        # Validate restaurant
        restaurant = Restaurant.objects.filter(
            name=clean_data["restaurant"]
        ).first()
        url = clean_data["url"]
        if restaurant:
            r = restaurant
        else:
            r = Restaurant(
                name=clean_data["restaurant"],
                url=url,
            )
            try:
                r.full_clean()
            except ValidationError as e:
                errors["restaurant"] = e.messages

        # Validate URL
        try:
            URLValidator()(url)
        except ValidationError as e:
            errors["url"] = e.messages

    data_dict = {
        "data": clean_data,
    }
    return data_dict


def list_from_form_data(data):
    """
    Convert the formdata foods into a list of food dict values
    """
    foods = []
    i = 0
    while any(f"food-{i}" in key for key in data):
        food = {
            "id": data.get(f"food-{i}-id", None),
            "name": data.get(f"food-{i}-name", ""),
            "rating": data[f"food-{i}-rating"],
            "image": data.get(f"food-{i}-image", None),
            "image_url": data.get(f"food-{i}-image-url", None),
            "tags": data.get(f"food-{i}-tags", "").split(","),
            "comment": data.get(f"food-{i}-comment", ""),
        }
        foods.append(food)
        i += 1
    return foods
