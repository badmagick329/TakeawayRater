from django.test import TestCase
from unittest import skip
from ..models import User, LinkRequest


class UserModelTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.user2 = User.objects.create_user(
            username="testuser2", password="testpassword2"
        )
        self.user3 = User.objects.create_user(
            username="testuser3", password="testpassword3"
        )

    def test_creation(self):
        """Basic creation test"""
        self.assertEqual(self.user1.username, "testuser")
        self.assertEqual(self.user2.username, "testuser2")
        self.assertEqual(self.user3.username, "testuser3")
        self.assertEqual(User.objects.count(), 3)

    def test_link_request(self):
        """Test that a link request can be created"""
        self.assertEqual(self.user1.link_requests.count(), 0)
        self.user1.send_request_to(self.user2)
        self.assertEqual(self.user1.link_requests.count(), 1)
        self.assertEqual(self.user2.link_requests.count(), 1)
        self.assertEqual(self.user3.link_requests.count(), 0)

    def test_link_request_accept(self):
        """Test users being linked on a link request accept"""
        self.user1.send_request_to(self.user2)
        self.assertEqual(self.user1.link_requests.count(), 1)
        self.assertEqual(self.user2.link_requests.count(), 1)
        self.user2.accept_request_from(self.user1)
        self.assertEqual(self.user1.link_requests.count(), 0)
        self.assertEqual(self.user2.link_requests.count(), 0)
        self.assertEqual(self.user1.linked_with.count(), 1)
        self.assertEqual(self.user2.linked_with.count(), 1)

    def test_link_request_reject(self):
        """Test users not being linked on a link request reject"""
        self.user1.send_request_to(self.user2)
        self.assertEqual(self.user1.link_requests.count(), 1)
        self.assertEqual(self.user2.link_requests.count(), 1)
        self.user2.reject_request_from(self.user1)
        self.assertEqual(self.user1.link_requests.count(), 0)
        self.assertEqual(self.user2.link_requests.count(), 0)
        self.assertEqual(self.user1.linked_with.count(), 0)
        self.assertEqual(self.user2.linked_with.count(), 0)

    def test_link_request_cancel(self):
        """Test users not being linked on a link request cancel"""
        self.user1.send_request_to(self.user2)
        self.assertEqual(self.user1.link_requests.count(), 1)
        self.assertEqual(self.user2.link_requests.count(), 1)
        self.user1.cancel_request_to(self.user2)
        self.assertEqual(self.user1.link_requests.count(), 0)
        self.assertEqual(self.user2.link_requests.count(), 0)
        self.assertEqual(self.user1.linked_with.count(), 0)
        self.assertEqual(self.user2.linked_with.count(), 0)

    def test_remove_linked_with_user(self):
        """Test users being unlinked"""
        self.user1.send_request_to(self.user2)
        self.user2.accept_request_from(self.user1)
        self.assertEqual(self.user1.linked_with.count(), 1)
        self.assertEqual(self.user2.linked_with.count(), 1)
        self.user1.remove_link_with(self.user2)
        self.assertEqual(self.user1.linked_with.count(), 0)
        self.assertEqual(self.user2.linked_with.count(), 0)

    def test_received_requests(self):
        """Test that a user can see received link requests"""
        self.user1.send_request_to(self.user2)
        self.assertEqual(self.user2.received_requests().count(), 1)
        self.assertEqual(self.user1.received_requests().count(), 0)

    def test_sent_requests(self):
        """Test that a user can see sent link requests"""
        self.user1.send_request_to(self.user2)
        self.assertEqual(self.user1.sent_requests().count(), 1)
        self.assertEqual(self.user2.sent_requests().count(), 0)

