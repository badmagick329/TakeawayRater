from django.db.models import CharField

from .mixins import CaseInsensitiveFieldMixin


class CaseInsensitiveCharField(CaseInsensitiveFieldMixin, CharField):
    """
    Makes django CharField case insensitive \n
    Extends both the `CaseInsensitiveMixin` and  CharField \n
    Then you can import
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
