from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import (
    api_view,
    renderer_classes,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from .models import User, LinkRequest, Restaurant, Tag, Food, Rating, Order
from datetime import datetime
from django.core.validators import ValidationError, URLValidator
from .utils import validate, clean_order_data


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

        return Response(resp)


class CreateOrder(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    renderer_classes = [JSONRenderer]

    def post(self, request, format=None):
        # print(f"CreateOrder received order data: {request.data.dict()}")
        result = clean_order_data(request.data.dict())

        if "errors" in result:
            return Response({"errors": result["errors"]})

        data = result["data"]
        # print(f"Cleaned order data: {data}")

        foods = data["foods"]
        foods_list = list()
        for food in foods:
            foods_list.append(
                {
                    "name": food["name"],
                    "rating": food["rating"],
                    "tags": food["tags"],
                    "image": food["image"],
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
        except ValidationError as e:
            # print("Validation error during create_order")
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
