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
from django.urls import include, path

urlpatterns = [
    path("orders-list", OrdersList.as_view()),
    path("create-order", CreateOrder.as_view()),
    path("edit-order/<int:pk>", EditOrder.as_view()),
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
