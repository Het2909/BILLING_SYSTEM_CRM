from django.db import models


class Customer(models.Model):

    name = models.CharField(
        max_length=255
    )

    phone = models.CharField(
        max_length=15,
        unique=True
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    address = models.TextField(
        blank=True,
        null=True
    )

    loyalty_points = models.IntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.name} - {self.phone}"
