from django.core.exceptions import ValidationError
from django.test import TestCase

from ..models import Food, Order, Rating, Restaurant, Tag, User
from .dbsetup import setup1


class FoodModelTest(TestCase):
    def setUp(self):
        setup1(self)

    def test_creation(self):
        """Basic creation test"""
        count = Food.objects.count()
        food = Food.objects.create(name="Cheese Burger", restaurant=self.restaurant)
        self.assertEqual(food.name, "cheese burger")
        self.assertEqual(food.restaurant, self.restaurant)
        self.assertEqual(Food.objects.count(), count + 1)

    def test_duplicate_food_add_fails(self):
        """Test that a food can only be added once to a restaurant"""
        food = Food.objects.create(name="cheese burger", restaurant=self.restaurant)
        count = Food.objects.count()
        with self.assertRaises(ValidationError):
            food2 = Food.objects.create(
                name="cheese burger", restaurant=self.restaurant
            )
        self.assertEqual(Food.objects.count(), count)
        food2 = Food.objects.create(
            name="special cheese burger", restaurant=self.restaurant2
        )
        self.assertEqual(Food.objects.count(), count + 1)

    def test_empty_food_fail(self):
        """Test that a food cannot be created with no name"""
        count = Food.objects.count()
        with self.assertRaises(ValidationError):
            food = Food.objects.create(name="", restaurant=self.restaurant)
        self.assertEqual(Food.objects.count(), count)

    def test_food_serialize(self):
        """Test that a food can be serialized"""
        rating = Rating.objects.create(
            food=self.food, user=self.user, rating=5, comment="very good"
        )
        serialized = self.food.serialize(self.user)
        self.assertEqual(serialized["id"], self.food.id)
        self.assertEqual(serialized["name"], self.food.name)
        self.assertEqual(serialized["rating"], rating.rating)
        self.assertEqual(serialized["comment"], rating.comment)
        food_tags = [tag.name for tag in self.food.tags.all()]
        self.assertEqual(serialized["tags"], food_tags)
