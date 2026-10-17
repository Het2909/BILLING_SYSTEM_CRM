from django.db import models
from products.models import Product

class Stock(models.Model):

    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name='stock_record'
    )

    quantity = models.IntegerField(default=0)

    reorder_level = models.IntegerField(default=10)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product.name
