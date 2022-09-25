from django.core.exceptions import ValidationError
from django.test import TestCase
from .dbsetup import setup1
from ..models import Order, Rating
from datetime import datetime


class OrderModelTest(TestCase):
    def setUp(self):
        setup1(self)

    def test_creation(self):
        """Basic creation test"""
        order = Order.objects.create(user=self.user)
        self.assertEqual(order.user, self.user)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(order.foods.count(), 0)
        self.assertEqual(order.tags.count(), 0)
        self.assertTrue(order.created)

    def test_add_food(self):
        """Test adding food to order"""
        order = Order.objects.create(user=self.user)
        order.foods.add(self.food2)
        self.assertEqual(order.foods.count(), 1)
        self.assertEqual(order.foods.first(), self.food2)
        self.assertEqual(order.restaurant, self.food2.restaurant)

    def test_add_food_twice(self):
        """Test adding food to order twice"""
        order = Order.objects.create(user=self.user)
        order.foods.add(self.food2)
        order.foods.add(self.food2)
        self.assertEqual(order.foods.count(), 1)
        self.assertEqual(order.foods.first(), self.food2)
        self.assertEqual(order.restaurant, self.restaurant2)

    def test_add_different_restaurant_foods_fail(self):
        """Test adding food from different restaurants to order"""
        order = Order.objects.create(user=self.user)
        order.foods.add(self.food)
        with self.assertRaises(ValidationError):
            order.foods.add(self.food3)

    def test_add_different_restaurant_foods_fail2(self):
        """Test adding food from two different restaurants to order"""
        order = Order.objects.create(user=self.user)
        with self.assertRaises(ValidationError):
            order.foods.add(self.food, self.food2)

    def test_create_order_method(self):
        """Test create_order method"""
        order = Order.create_order(
            restaurant_name="new restaurant",
            url="https://newrestaurant.com",
            foods=[
                {
                    "name": "chicken sandwich",
                    "rating": 5,
                    "tags": ["burger", "chicken"],
                    "comment": "very good",
                }
            ],
            user=self.user,
        )
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.restaurant.name, "new restaurant")
        self.assertEqual(order.restaurant.url, "https://newrestaurant.com")
        self.assertEqual(order.foods.count(), 1)
        self.assertEqual(order.foods.first().name, "chicken sandwich")
        user_rating = Rating.objects.filter(user=self.user, food=order.foods.first())
        self.assertEqual(user_rating.count(), 1)
        user_rating = user_rating.first()
        self.assertEqual(user_rating.rating, 5)
        self.assertEqual(user_rating.comment, "very good")
        self.assertEqual(order.foods.first().tags.count(), 2)

    def test_create_order_duplicate_food(self):
        """
        Test create_order method with duplicate food.
        Order should only create unique foods
        """
        order = Order.create_order(
            restaurant_name="new restaurant",
            url="https://newrestaurant.com",
            foods=[
                {
                    "name": "chicken sandwich",
                    "rating": 5,
                    "tags": ["burger", "chicken"],
                    "comment": "very good",
                },
                {
                    "name": "chicken sandwich",
                    "rating": 3,
                    "tags": ["burger", "chicken"],
                    "comment": "very good",
                },
            ],
            user=self.user,
        )
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.foods.count(), 1)
        self.assertEqual(order.foods.first().name, "chicken sandwich")
        user_rating = Rating.objects.filter(user=self.user, food=order.foods.first())
        self.assertEqual(user_rating.count(), 1)
        user_rating = user_rating.first()
        self.assertEqual(user_rating.rating, 3)

    def test_order_serialize(self):
        """Test serialize method"""
        order = Order.create_order(
            restaurant_name="new restaurant",
            url="https://newrestaurant.com",
            foods=[
                {
                    "name": "chicken sandwich",
                    "rating": 3,
                    "tags": ["burger", "chicken"],
                    "comment": "very good",
                },
            ],
            user=self.user,
        )
        serialized = order.serialize(self.user)
        self.assertEqual(serialized["id"], order.id)
        self.assertEqual(serialized["restaurant"], order.restaurant.name)
        self.assertEqual(serialized["url"], order.restaurant.url)
        self.assertEqual(
            serialized["tags"], list(order.tags.values_list("name", flat=True))
        )
        self.assertEqual(serialized["order_date"], order.created_str)
        self.assertEqual(serialized["foods"][0]["name"], "chicken sandwich")
        self.assertEqual(serialized["foods"][0]["name"], "chicken sandwich")
        self.assertEqual(serialized["foods"][0]["rating"], 3)
        self.assertEqual(serialized["foods"][0]["tags"], ["burger", "chicken"])
        self.assertEqual(serialized["foods"][0]["comment"], "very good")
