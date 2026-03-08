from django.urls import path
from .views import submit_quote

urlpatterns = [
    path('submit/', submit_quote),
]