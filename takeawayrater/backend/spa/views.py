from backend.api.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView


class SpaView(LoginRequiredMixin, TemplateView):
    template_name = "spa/index.html"


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect("/")
        else:
            return render(
                request,
                "registration/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "registration/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect("/")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request,
                "registration/register.html",
                {"message": "Passwords must match."},
            )
        elif not password:
            return render(
                request,
                "registration/register.html",
                {"message": "Password cannot be empty."},
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request,
                "registration/register.html",
                {"message": "Username already taken."},
            )
        login(request, user)
        return HttpResponseRedirect("/")
    else:
        return render(request, "registration/register.html")
