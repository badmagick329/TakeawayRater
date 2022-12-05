from django.core.validators import ValidationError
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    renderer_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from .models import LinkRequest, User


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def links_list(request, *args, **kwargs):
    linked_users = User.objects.filter(linked_with=request.user)
    resp = [u.serialize() for u in linked_users]
    return Response(resp)


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def send_link_request(request, *args, **kwargs):
    user_id = request.data.get("id", None)
    if user_id is None:
        return Response({"success": False, "message": "User ID is required"})

    user = User.objects.filter(pk=user_id).first()
    if user is None:
        return Response({"success": False, "message": "User does not exist"})

    try:
        link_request = request.user.send_request_to(user)
        return Response({"success": True, "message": "Link request sent"})
    except ValidationError as e:
        return Response({"success": False, "message": e})


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def accept_link_request(request, *args, **kwargs):
    user_id = request.data.get("id", None)
    if user_id is None:
        return Response({"success": False, "message": "User ID is required"})

    user = User.objects.filter(pk=user_id).first()
    if user is None:
        return Response({"success": False, "message": "User does not exist"})

    try:
        link_request = request.user.accept_request_from(user)
        return Response({"success": True})
    except ValidationError as e:
        return Response({"success": False, "message": e})


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def reject_link_request(request, *args, **kwargs):
    user_id = request.data.get("id", None)
    if user_id is None:
        return Response({"success": False, "message": "User ID is required"})

    user = User.objects.filter(pk=user_id).first()
    if user is None:
        return Response({"success": False, "message": "User does not exist"})

    try:
        request.user.reject_request_from(user)
        return Response({"success": True})
    except ValidationError as e:
        return Response({"success": False, "message": e})


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def remove_link(request, pk, *args, **kwargs):
    user = User.objects.filter(pk=pk).first()
    if user is None:
        return Response({"success": False, "message": "User does not exist"})

    try:
        request.user.remove_link_with(user)
        return Response({"success": True})
    except ValidationError as e:
        return Response({"success": False, "message": [e]})


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def search_users(request, *args, **kwargs):
    q = request.query_params.get("q", "").strip()
    if q == "":
        return Response({"success": False, "message": "You must provide a search term"})
    linked_users = User.objects.filter(linked_with=request.user)
    users = (
        User.objects.filter(username__icontains=q)
        .exclude(pk=request.user.pk)
        .exclude(pk__in=linked_users)
    )
    if users:
        resp = [u.serialize() for u in users]
        return Response({"success": True, "users": resp})
    return Response({"success": True, "users": []})


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def link_requests_list(request, *args, **kwargs):
    users = request.user.received_requests()
    return Response({"success": True, "users": [u.serialize() for u in users]})
