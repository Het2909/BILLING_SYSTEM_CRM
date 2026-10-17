from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class Product(models.Model):
    name = models.CharField(max_length=255)

    sku = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True
    )

    barcode = models.CharField(
        max_length=100,
        unique=True
    )

    category = models.CharField(max_length=100)

    brand = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    purchase_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    selling_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock = models.IntegerField(default=0)

    minimum_stock = models.IntegerField(default=5)

    gst_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
