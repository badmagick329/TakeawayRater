from django.core.exceptions import ValidationError
from django.test import TestCase

from ..models import Restaurant


class RestaurantModelTest(TestCase):
    def test_creation(self):
        """Test that a restaurant can be created"""
        restaurant = Restaurant.objects.create(
            name="test", url="https://test.com"
        )
        self.assertEqual(restaurant.name, "test")
        self.assertEqual(restaurant.url, "https://test.com")
        self.assertEqual(Restaurant.objects.count(), 1)

    def test_duplicate_creation_fail(self):
        """Test that a restaurant cannot be created with the same name"""
        restaurant = Restaurant.objects.create(
            name="test", url="https://test.com"
        )
        self.assertEqual(Restaurant.objects.count(), 1)
        with self.assertRaises(ValidationError):
            restaurant2 = Restaurant.objects.create(
                name="TEST", url="https://test.com"
            )
        self.assertEqual(Restaurant.objects.count(), 1)

    def test_duplicate_url_creation_fail(self):
        """Test that a restaurant cannot be created with the same url"""
        restaurant = Restaurant.objects.create(
            name="test", url="https://test.com"
        )
        self.assertEqual(Restaurant.objects.count(), 1)
        with self.assertRaises(ValidationError):
            Restaurant.objects.create(name="test2", url="https://test.com?a=1")
        self.assertEqual(Restaurant.objects.count(), 1)
        with self.assertRaises(ValidationError):
            Restaurant.objects.create(
                name="test3", url="https://test.com/?a=1"
            )
        self.assertEqual(Restaurant.objects.count(), 1)

    def test_duplicate_url_creation_fail_2(self):
        """Test that a restaurant cannot be created with the same url"""
        restaurant = Restaurant.objects.create(
            name="test", url="https://test.com?a=1"
        )
        self.assertEqual(Restaurant.objects.count(), 1)
        with self.assertRaises(ValidationError):
            Restaurant.objects.create(name="test2", url="https://test.com?a=5")
        self.assertEqual(Restaurant.objects.count(), 1)
        with self.assertRaises(ValidationError):
            Restaurant.objects.create(
                name="test3", url="https://test.com/?a=6"
            )
        self.assertEqual(Restaurant.objects.count(), 1)

    def test_duplicate_url_creation_fail_3(self):
        """Test that a restaurant cannot be created with the same url"""
        restaurant = Restaurant.objects.create(
            name="test", url="https://test.com/?a=1"
        )
        self.assertEqual(Restaurant.objects.count(), 1)
        with self.assertRaises(ValidationError):
            Restaurant.objects.create(name="test2", url="https://test.com")
        self.assertEqual(Restaurant.objects.count(), 1)
        with self.assertRaises(ValidationError):
            Restaurant.objects.create(name="test3", url="https://test.com?a=5")
        self.assertEqual(Restaurant.objects.count(), 1)

    def test_duplicate_url_creation_pass(self):
        """Test that different restaurants can be created with different urls"""
        restaurant = Restaurant.objects.create(
            name="test", url="https://test.com"
        )
        self.assertEqual(Restaurant.objects.count(), 1)
        restaurant2 = Restaurant.objects.create(
            name="test2", url="https://test2.com"
        )
        self.assertEqual(Restaurant.objects.count(), 2)
