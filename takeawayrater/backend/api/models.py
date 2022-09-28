from django.contrib.auth.models import AbstractUser
from django.db.models.signals import m2m_changed, pre_save, post_save, pre_delete
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.validators import ValidationError
from django.db import models
from django.db.models import Avg
from django.dispatch import receiver
from datetime import datetime
from .fields import CaseInsensitiveCharField
from typing import List
from django.core.files.storage import default_storage


"""
TODO order can have 0 foods
"""

@receiver(pre_save)
def pre_save_handler(sender, instance, *args, **kwargs):
    """Ensure full clean is called before every save"""
    if sender in (Tag, Restaurant, Food, Rating, User, Order):
        instance.full_clean()


@receiver(pre_delete)
def pre_delete_handler(sender, instance, *args, **kwargs):
    if sender == Food:
        if instance.image:
            default_storage.delete(instance.image.name)


class LinkRequest(models.Model):
    from_user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="from_user"
    )
    to_user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="to_user"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"<LinkRequest {self.from_user} -> {self.to_user}>"

    class Meta:
        unique_together = ("from_user", "to_user")


class User(AbstractUser):
    linked_with = models.ManyToManyField("self", blank=True)
    link_requests = models.ManyToManyField(LinkRequest, blank=True)

    def send_request_to(self, user):
        """Send a link request to another user"""
        if user == self:
            raise ValidationError("Cannot send a link request to yourself")
        if user in self.linked_with.all():
            raise ValidationError("Already linked with user")
        if user in self.sent_requests():
            raise ValidationError("Already sent a link request to user")

        link_request = LinkRequest.objects.create(from_user=self, to_user=user)
        self.link_requests.add(link_request)
        user.link_requests.add(link_request)

        return link_request

    def cancel_request_to(self, user):
        """Cancel a link request to another user"""
        if user not in self.sent_requests():
            raise ValidationError("No link request to user")
        link_request = LinkRequest.objects.get(from_user=self, to_user=user)
        link_request.delete()

    def accept_request_from(self, user):
        """Accept a link request from another user"""
        if user not in self.received_requests():
            raise ValidationError("No link request from user")
        link_request = LinkRequest.objects.get(from_user=user, to_user=self)
        self.linked_with.add(user)
        user.linked_with.add(self)
        link_request.delete()

    def reject_request_from(self, user):
        """Reject a link request from another user"""
        if user not in self.received_requests():
            raise ValidationError("No link request from user")
        link_request = LinkRequest.objects.get(from_user=user, to_user=self)
        link_request.delete()

    def remove_link_with(self, user):
        """Remove a link with another user"""
        if user not in self.linked_with.all():
            raise ValidationError("Not linked with user")
        self.linked_with.remove(user)
        user.linked_with.remove(self)

    def sent_requests(self):
        """Return a queryset of users that this user has sent a link request to"""
        return User.objects.filter(link_requests__from_user=self).exclude(pk=self.pk)

    def received_requests(self):
        """Return a queryset of users that have sent a link request to this user"""
        return User.objects.filter(link_requests__to_user=self).exclude(pk=self.pk)

    def serialize(self):
        return {"id": self.id, "username": self.username}

    def __str__(self):
        return self.username


class Tag(models.Model):
    name = CaseInsensitiveCharField(
        max_length=50,
        unique=True,
        blank=False,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"<Tag name={self.name}>"


class Restaurant(models.Model):
    name = CaseInsensitiveCharField(
        max_length=100,
        unique=True,
    )

    url = models.URLField(max_length=300, blank=True, null=True)
    # This field can have additional tags added to it when a new order
    # is created. This is done by the m2m_changed signal handler below.
    tags = models.ManyToManyField(Tag, blank=True, related_name="restaurants")
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def clean(self):
        base_url = self.url.split("?")[0]
        if base_url == "":
            return
        base_url = base_url[:-1] if base_url.endswith("/") else base_url
        restaurants = Restaurant.objects.filter(url__startswith=base_url).exclude(
            pk=self.id
        )

        if restaurants:
            raise ValidationError(
                f"{restaurants[0].name.title()} is using the url provided"
            )

    def __str__(self):
        return f"<Restaurant name={self.name}, url={self.url}>"


class Food(models.Model):
    name = CaseInsensitiveCharField(max_length=100)
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name="foods"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="foods")
    image = models.ImageField(upload_to="food_images", blank=True, null=True)
    # TODO Add validation for this field
    image_url = models.URLField(max_length=300, blank=True, null=True)

    MISSING_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Comic_image_missing.svg"
    FOOD_IMAGES_PATH = "/media/food_images/"

    class Meta:
        constraints = [
            models.UniqueConstraint("name", "restaurant", name="unique_food")
        ]

    def __str__(self):
        return f"<Food name={self.name}, restaurant={self.restaurant.name}>"

    def serialize(self, user: User):
        user_rating = self.ratings.filter(user=user)
        user_rating = user_rating.first() if user_rating else None
        return {
            "id": self.id,
            "name": self.name,
            "rating": user_rating.rating if user_rating else None,
            "tags": [tag.name for tag in self.tags.all()],
            "image": self.image.url
            if self.image
            else Food.MISSING_URL,
            "image_url": self.image_url,
            "comment": user_rating.comment if user_rating else "",
        }


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    food = models.ForeignKey(Food, on_delete=models.CASCADE, related_name="ratings")
    rating = models.IntegerField(
        validators=[MaxValueValidator(5), MinValueValidator(1)]
    )
    comment = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]
        unique_together = ("user", "food")

    def __str__(self):
        return f"<Rating user={self.user}, food={self.food}, rating={self.rating}>"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    foods = models.ManyToManyField(Food, related_name="orders")
    created = models.DateTimeField(auto_now_add=True)

    # These will be auto set/unset when foods are added/removed
    _restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="orders",
    )
    _tags = models.ManyToManyField(Tag, related_name="orders")

    class Meta:
        ordering = ["-created"]
        constraints = [
            models.UniqueConstraint(
                "user", "_restaurant", "created", name="unique_order"
            ),
        ]

    def serialize(self, user: User, include_ordered_by=False):
        ret = {
            "id": self.id,
            "restaurant": self.restaurant.name,
            "url": self.restaurant.url,
            "order_date": self.created_str,
            "foods": [food.serialize(self.user) for food in self.foods.all()],
            "tags": list(self.tags.values_list("name", flat=True)),
        }
        if include_ordered_by:
            ret["ordered_by"] = "You" if user == self.user else self.user.username
        return ret

    @property
    def created_str(self):
        return datetime.strftime(self.created, "%Y-%m-%d")

    @property
    def restaurant(self):
        return self._restaurant

    @property
    def tags(self):
        return self._tags.all()

    def clean_delete(self, user: User):
        if self.user != user:
            return False
        restaurant_orders = Order.objects.filter(_restaurant=self.restaurant)
        if restaurant_orders.count() == 1:
            self.restaurant.delete()
        orphan_tags = Tag.objects.filter(foods__isnull=True)
        orphan_tags.delete()
        self.delete()
        return True

    @staticmethod
    def edit_order(
            order,
            restaurant_name: str,
            foods: List[dict],
            url: str = None,
            restaurant_tags: List[str] = None,
    ):
        """
        Convenience method for editing an order. Similar to create_order.

        Keys in the food dict:

        - name: Name of the food (Required)
        - rating: Rating for the food (Required)
        - image: Image for the food (Optional)
        - image_url: URL to the image of the food (Optional)
        - tags: List of tags for the food (optional)
        - comment: Comment for the food (optional)

        :param restaurant_name: Name of the restaurant
        :param foods: List of food dicts (Must have at least one dict)
        :param user: User object
        :param url: URL of the restaurant (Optional)
        """

        if order.restaurant.name != restaurant_name:
            order.restaurant.name = restaurant_name
            order.restaurant.save()
        if order.restaurant.url != url:
            order.restaurant.url = url
            order.restaurant.save()

        food_objs = []
        for food in foods:
            food_name = food["name"]
            if food["id"]:
                food_obj = Food.objects.filter(id=food["id"]).first()
                if food_obj:
                    if food_obj.name != food["name"]:
                        food_obj.name = food["name"]
                        food_obj.save()
                else:
                    food_obj, _ = Food.objects.get_or_create(
                        name=food_name, restaurant=order.restaurant
                    )
            else:
                food_obj, _ = Food.objects.get_or_create(
                    name=food_name, restaurant=order.restaurant
                )

            food_rating = food["rating"]
            food_comment = food.get("comment")
            food_tags = food.get("tags", [])
            food_image = food.get("image")
            if food.get("image_url") and not food.get("image_url").startswith(Food.FOOD_IMAGES_PATH):
                food_image_url = food.get("image_url")
            else:
                food_image_url = None

            if food_image:
                food_obj.image = food_image
            elif food_image_url:
                food_obj.image_url = food_image_url
            food_obj.save()

            for tag_name in food_tags:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                food_obj.tags.add(tag)
            rating, _ = Rating.objects.get_or_create(
                user=order.user, food=food_obj, defaults={"rating": food_rating}
            )
            rating.rating = food_rating
            rating.comment = food_comment
            rating.save()
            food_objs.append(food_obj)
        order.foods.set(food_objs)
        order.save()

    @staticmethod
    def create_order(
        restaurant_name: str,
        foods: List[dict],
        user: User,
        url: str = None,
        restaurant_tags: List[str] = None,
    ):
        """
        Convenience method for creating an order. This will also create intermediate
        objects if they don't exist.

        Keys in the food dict:

        - name: Name of the food (Required)
        - rating: Rating for the food (Required)
        - image: Image for the food (Optional)
        - image_url: URL to the image of the food (Optional)
        - tags: List of tags for the food (optional)
        - comment: Comment for the food (optional)

        :param restaurant_name: Name of the restaurant
        :param foods: List of food dicts (Must have at least one dict)
        :param user: User object
        :param url: URL of the restaurant (Optional)
        :param restaurant_tags: List of tags to explicitly add to the restaurant (Optional)
        """
        restaurant = Restaurant.objects.filter(name=restaurant_name).first()
        if restaurant:
            restaurant.url = url if url else restaurant.url
        else:
            restaurant = Restaurant.objects.create(name=restaurant_name, url=url)

        if restaurant_tags:
            for tag in restaurant_tags:
                restaurant.tags.add(Tag.objects.get_or_create(name=tag)[0])

        order = None if foods else Order.objects.create(user=user, _restaurant=restaurant)

        for food in foods:
            food_obj, created = Food.objects.get_or_create(
                name=food["name"], restaurant=restaurant
            )

            for tag in food.get("tags", []):
                food_obj.tags.add(Tag.objects.get_or_create(name=tag)[0])
            if food.get("image"):
                food_obj.image = food["image"]
            elif food.get("image_url") and not food.get("image_url").startswith(Food.FOOD_IMAGES_PATH):
                food_obj.image_url = food.get("image_url")
            food_obj.save()

            rating = Rating.objects.filter(user=user, food=food_obj)

            if rating:
                rating = rating[0]
                rating.rating = food["rating"]
                if food.get("comment", ""):
                    rating.comment = food["comment"]
                rating.save()
            else:
                rating = Rating.objects.create(
                    user=user,
                    food=food_obj,
                    rating=food["rating"],
                    comment=food.get("comment", ""),
                )

            if order is None:
                order = Order.objects.create(user=user)
            order.foods.add(food_obj)

        return order

    def __str__(self):
        s = f"<Order user={self.user}, restaurant={self._restaurant}>"
        if self.foods:
            s += f", foods={self.foods.all()}"
        if self.tags:
            s += f", tags={self.tags}"
        return s

# TODO - Add a change signal to this

@receiver(m2m_changed, sender=Order.foods.through)
def m2m_changed_order_handler(sender, instance, action, model, pk_set, *args, **kwargs):
    """
    Ensure restaurant is set when foods are added and that the restaurant
    is the same for all foods. Also, ensure that the restaurant has updated
    tags.
    """
    if model != Food:
        return

    if action == "pre_add" and pk_set:
        foods = Food.objects.filter(pk__in=pk_set).prefetch_related(
            "restaurant", "tags"
        )
        restaurants = set([f.restaurant for f in foods])

        if len(restaurants) > 1:
            raise ValidationError("All foods must be from the same restaurant")

        restaurant = restaurants.pop()
        if instance.restaurant is None:
            instance._restaurant = restaurant
            instance.save()
        elif instance.restaurant and instance.restaurant != restaurant:
            raise ValidationError("All foods must be from the same restaurant")

        tags = set([t for f in foods for t in f.tags.all()])
        instance._tags.set(tags)
        # Add the food tags from this order to the restaurant tags
        instance.restaurant.tags.add(*tags)

    elif action == "post_remove":
        if instance.foods.count() == 0:
            instance._restaurant = None
            instance._tags.clear()
        else:
            foods_now = instance.foods.all().prefetch_related("tags")
            tags_now = set([t for f in foods_now for t in f.tags.all()])
            instance._tags.set(tags_now)
