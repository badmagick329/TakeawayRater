from datetime import datetime

from django.contrib.auth import authenticate, login, logout
from django.core.validators import URLValidator, ValidationError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from rest_framework import authentication, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes, renderer_classes)
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Food, LinkRequest, Order, Rating, Restaurant, Tag, User
from .utils import clean_order_data, validate


class OrdersList(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    renderer_classes = [JSONRenderer]

    def get(self, request, format=None):
        visible_users = list(User.objects.filter(linked_with=request.user))

        if len(visible_users) > 0:
            visible_users.append(request.user)
            orders = Order.objects.filter(user__in=visible_users)
            resp = [o.serialize(request.user, include_ordered_by=True) for o in orders]
        else:
            orders = Order.objects.filter(user=request.user)
            resp = [o.serialize(request.user) for o in orders]
        # print("Returning orders: ")
        # for o in resp:
        #     for k, v in o.items():
        #         print(f"{k}: {v}")
        #     print("----")

        return Response(resp)


class CreateOrder(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    renderer_classes = [JSONRenderer]

    def post(self, request, format=None):
        result = clean_order_data(request.data.dict())

        if "errors" in result:
            return Response({"errors": result["errors"]})

        data = result["data"]

        foods = data["foods"]
        foods_list = list()
        for food in foods:
            foods_list.append(
                {
                    "name": food["name"],
                    "rating": food["rating"],
                    "tags": food["tags"],
                    "image": food["image"],
                    "image_url": food["image_url"],
                    "comment": food["comment"],
                }
            )
        try:
            order = Order.create_order(
                restaurant_name=data["restaurant"],
                user=request.user,
                url=data["url"],
                foods=foods_list,
            )
            print(f"{order} created")
        except ValidationError as e:
            return Response({"errors": {"restaurant": e}})

        return Response({"success": True})


class EditOrder(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    renderer_classes = [JSONRenderer]

    def post(self, request, pk, format=None):
        saved_order = Order.objects.filter(pk=pk).first()
        if saved_order is None:
            return Response({"errors": {"order": "Order does not exist"}})
        if saved_order.user != request.user:
            return Response({"errors": {"order": "You cannot edit this order"}})

        result = clean_order_data(request.data.dict())
        if "errors" in result:
            return Response({"errors": result["errors"]})

        data = result["data"]

        foods = data["foods"]
        foods_list = list()
        for food in foods:
            foods_list.append(
                {
                    "id": food["id"],
                    "name": food["name"],
                    "rating": food["rating"],
                    "tags": food["tags"],
                    "image": food["image"],
                    "image_url": food["image_url"],
                    "comment": food["comment"],
                }
            )
        try:
            order = Order.edit_order(
                saved_order,
                restaurant_name=data["restaurant"],
                url=data["url"],
                foods=foods_list,
            )
        except ValidationError as e:
            return Response({"errors": {"restaurant": e}})

        return Response({"success": True})


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def validate_data(request, *args, **kwargs):
    # print(f"validate_data received order data: {request.data.dict()}")
    return Response(validate(request.data, request.user))


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def delete_order(request, pk, *args, **kwargs):
    order = Order.objects.filter(id=pk, user=request.user).first()
    if order and order.clean_delete(request.user):
        return Response({"success": True})
    return Response({"success": False})


@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    print(f"LOGGING OUT USER: {request.user}")
    logout(request)
    return HttpResponseRedirect(reverse("api:index"))
