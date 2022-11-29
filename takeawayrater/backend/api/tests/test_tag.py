from django.core.exceptions import ValidationError
from django.test import TestCase

from ..models import Order, Tag
from .dbsetup import setup1


class TagModelTest(TestCase):
    def setUp(self):
        setup1(self)

    def test_creation(self):
        """Test creating a tag"""
        tag = Tag.objects.create(name="test")
        self.assertEqual(tag.name, "test")
        self.assertEqual(Tag.objects.count(), 5)

    def test_duplicate_creation_fail(self):
        """Test creating duplicate tag fails"""
        tag = Tag.objects.create(name="test")
        self.assertEqual(Tag.objects.count(), 5)
        with self.assertRaises(ValidationError):
            tag2 = Tag.objects.create(name="TEST")
            tag2.save()
        self.assertEqual(Tag.objects.count(), 5)

    def test_order_tags_addition(self):
        """Test adding tags to order"""
        order1 = Order.objects.create(user=self.user)
        order2 = Order.objects.create(user=self.user)
        order1.foods.add(self.food2)
        order2.foods.add(self.food3)
        self.assertEqual(order1.tags.count(), 2)
        self.assertEqual(order2.tags.count(), 1)

    def test_order_tags_removal(self):
        """Test removing tags from order"""
        order1 = Order.objects.create(user=self.user)
        order1.foods.add(self.food2)
        self.assertEqual(order1.tags.count(), 2)
        order1.foods.remove(self.food2)
        self.assertEqual(order1.tags.count(), 0)

    def test_food_tags(self):
        """Test adding and removing tags from a food"""
        self.assertEqual(self.food.tags.count(), 1)
        self.food.tags.add(self.chicken_tag)
        self.assertEqual(self.food.tags.count(), 2)
        self.food.tags.remove(self.chicken_tag)
        self.assertEqual(self.food.tags.count(), 1)
        self.food.tags.add(self.chicken_tag)
        self.food.tags.add(self.pizza_tag)
        self.assertEqual(self.food.tags.count(), 3)
        self.food.tags.clear()
        self.assertEqual(self.food.tags.count(), 0)

    def test_restaurant_tags(self):
        """Test adding and removing tags from a restaurant"""
        self.assertEqual(self.restaurant.tags.count(), 0)
        self.restaurant.tags.add(self.chicken_tag)
        self.assertEqual(self.restaurant.tags.count(), 1)
        self.restaurant.tags.remove(self.chicken_tag)
        self.assertEqual(self.restaurant.tags.count(), 0)
        self.restaurant.tags.add(self.chicken_tag)
        self.restaurant.tags.add(self.pizza_tag)
        self.assertEqual(self.restaurant.tags.count(), 2)
        self.restaurant.tags.clear()
        self.assertEqual(self.restaurant.tags.count(), 0)

    def test_auto_add_tags_to_restaurant_from_order(self):
        """Test tags being auto added to a restaurant when foods with said tags are
        added to an order from that restaurant"""
        order1 = Order.objects.create(user=self.user)
        order1.foods.add(self.food2)
        self.assertEqual(self.restaurant2.tags.count(), 2)
        order1.foods.add(self.food3)
        self.assertEqual(self.restaurant2.tags.count(), 3)
        order1.foods.remove(self.food2)
        self.assertEqual(self.restaurant2.tags.count(), 3)
        order1.foods.remove(self.food3)
        self.assertEqual(self.restaurant2.tags.count(), 3)
