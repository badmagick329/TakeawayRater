from django.contrib import admin
from django.urls import path, include
from backend.api.views import OrdersList, validate_data, CreateOrder, delete_order
from backend.api.views_social import (
    links_list,
    link_requests_list,
    send_link_request,
    accept_link_request,
    reject_link_request,
    remove_link,
    search_users,
)

urlpatterns = [
    path("orders-list", OrdersList.as_view()),
    path("create-order", CreateOrder.as_view()),
    path("delete-order/<int:pk>", delete_order),
    path("validate", validate_data),
    path("links-list", links_list),
    path("link-requests-list", link_requests_list),
    path("send-link-request", send_link_request),
    path("accept-link-request", accept_link_request),
    path("reject-link-request", reject_link_request),
    path("remove-link/<int:pk>", remove_link),
    path("search-users", search_users),
]
