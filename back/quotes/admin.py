from django.contrib import admin
from .models import Quote

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'pickup', 'delivery', 'created_at')