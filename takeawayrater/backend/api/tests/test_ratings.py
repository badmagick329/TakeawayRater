from django.core.validators import ValidationError
from django.test import TestCase

from ..models import Order, Rating
from .dbsetup import setup1


class RatingModelTest(TestCase):
    def setUp(self):
        setup1(self)
        self.order = Order.objects.create(user=self.user)

    def test_creation(self):
        """Basic creation test"""
        rating = Rating.objects.create(
            user=self.user, food=self.food, rating=5
        )
        self.assertEqual(rating.user, self.user)
        self.assertEqual(rating.food, self.food)
        self.assertEqual(rating.rating, 5)
        self.assertEqual(Rating.objects.count(), 1)
        rating2 = Rating.objects.create(
            user=self.user2, food=self.food, rating=3
        )
        self.assertEqual(rating2.user, self.user2)
        self.assertEqual(rating2.food, self.food)
        self.assertEqual(rating2.rating, 3)
        self.assertEqual(Rating.objects.count(), 2)
        rating3 = Rating.objects.create(
            user=self.user, food=self.food2, rating=4
        )
        self.assertEqual(rating3.user, self.user)
        self.assertEqual(rating3.food, self.food2)
        self.assertEqual(rating3.rating, 4)
        self.assertEqual(Rating.objects.count(), 3)
        rating4 = Rating.objects.create(
            user=self.user, food=self.food3, rating=1
        )
        self.assertEqual(rating4.user, self.user)
        self.assertEqual(rating4.food, self.food3)
        self.assertEqual(rating4.rating, 1)
        self.assertEqual(Rating.objects.count(), 4)

    def test_creation_fail(self):
        """Test that creation fails when rating is not between 1 and 5"""
        with self.assertRaises(ValidationError):
            rating = Rating.objects.create(
                user=self.user, food=self.food, rating=6
            )
        self.assertEqual(Rating.objects.count(), 0)
        with self.assertRaises(ValidationError):
            rating = Rating.objects.create(
                user=self.user, food=self.food, rating=0
            )
        self.assertEqual(Rating.objects.count(), 0)
        with self.assertRaises(ValidationError):
            rating = Rating.objects.create(
                user=self.user, food=self.food, rating=-1
            )
        self.assertEqual(Rating.objects.count(), 0)

    def test_duplicate_creation_fail(self):
        """Test that creation fails when user has already rated food"""
        rating = Rating.objects.create(
            user=self.user, food=self.food, rating=5
        )
        self.assertEqual(Rating.objects.count(), 1)
        with self.assertRaises(ValidationError):
            rating2 = Rating.objects.create(
                user=self.user, food=self.food, rating=3
            )
        self.assertEqual(Rating.objects.count(), 1)

    def test_update(self):
        """Test that update works"""
        rating = Rating.objects.create(
            user=self.user, food=self.food, rating=5
        )
        self.assertEqual(rating.rating, 5)
        rating.rating = 3
        self.assertEqual(rating.rating, 3)
        self.assertEqual(Rating.objects.count(), 1)
