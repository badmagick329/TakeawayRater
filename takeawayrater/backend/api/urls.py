from backend.api.views import (
    CreateOrder,
    EditOrder,
    OrdersList,
    delete_order,
    validate_data,
)
from backend.api.views_social import (
    accept_link_request,
    link_requests_list,
    links_list,
    reject_link_request,
    remove_link,
    search_users,
    send_link_request,
)
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("orders-list", OrdersList.as_view(), name="orders-list"),
    path("create-order", CreateOrder.as_view(), name="create-order"),
    path("edit-order/<int:pk>", EditOrder.as_view(), name="edit-order"),
    path("delete-order/<int:pk>", delete_order, name="delete-order"),
    path("validate", validate_data, name="validate"),
    path("links-list", links_list, name="links-list"),
    path("link-requests-list", link_requests_list, name="link-requests-list"),
    path("send-link-request", send_link_request, name="send-link-request"),
    path("accept-link-request", accept_link_request, name="accept-link-request"),
    path("reject-link-request", reject_link_request, name="reject-link-request"),
    path("remove-link/<int:pk>", remove_link, name="remove-link"),
    path("search-users", search_users, name="search-users"),
]
