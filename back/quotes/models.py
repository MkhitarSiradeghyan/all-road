from django.db import models

class Quote(models.Model):
    pickup = models.CharField(max_length=100)
    delivery = models.CharField(max_length=100)
    vehicle_make = models.CharField(max_length=50)
    vehicle_model = models.CharField(max_length=50)
    year = models.CharField(max_length=10)
    pickup_date = models.DateField()
    transport_type = models.CharField(max_length=20)
    vehicle_condition = models.CharField(max_length=20)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)