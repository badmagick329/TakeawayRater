from django.contrib import admin

from .models import Food, LinkRequest, Order, Rating, Restaurant, Tag, User

# Register your models here.
admin.site.register(User)
admin.site.register(LinkRequest)
admin.site.register(Restaurant)
admin.site.register(Rating)
admin.site.register(Food)
admin.site.register(Tag)
admin.site.register(Order)
