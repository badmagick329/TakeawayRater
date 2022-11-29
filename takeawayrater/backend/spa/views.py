from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView


class SpaView(LoginRequiredMixin, TemplateView):
    template_name = "spa/index.html"
