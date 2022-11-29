from ..models import Food, Restaurant, Tag, User


def setup1(instance):
    instance.burger_tag = Tag.objects.create(name="burger")
    instance.chicken_tag = Tag.objects.create(name="chicken")
    instance.pizza_tag = Tag.objects.create(name="pizza")
    instance.nuggets_tag = Tag.objects.create(name="chicken nuggets")

    instance.restaurant = Restaurant.objects.create(
        name="test", url="https://test.com"
    )
    instance.restaurant2 = Restaurant.objects.create(
        name="test2", url="https://test2.com"
    )
    instance.user = User.objects.create(
        username="testuser", password="testpassword"
    )
    instance.user2 = User.objects.create(
        username="testuser2", password="testpassword2"
    )
    instance.food = Food.objects.create(
        name="burger", restaurant=instance.restaurant
    )
    instance.food2 = Food.objects.create(
        name="chicken nuggets", restaurant=instance.restaurant2
    )
    instance.food3 = Food.objects.create(
        name="pizza", restaurant=instance.restaurant2
    )
    instance.food.tags.add(instance.burger_tag)
    instance.food2.tags.add(instance.nuggets_tag)
    instance.food2.tags.add(instance.chicken_tag)
    instance.food3.tags.add(instance.pizza_tag)
