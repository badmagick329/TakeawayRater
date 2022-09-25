from django.contrib import admin

from .models import User, LinkRequest, Restaurant, Rating, Food, Tag, Order

# Register your models here.
admin.site.register(User)
admin.site.register(LinkRequest)
admin.site.register(Restaurant)
admin.site.register(Rating)
admin.site.register(Food)
admin.site.register(Tag)
admin.site.register(Order)
