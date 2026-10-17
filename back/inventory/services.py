from django.db import transaction
from rest_framework import serializers

from .models import Stock


def get_or_create_stock(product):
    stock, _ = Stock.objects.get_or_create(
        product=product,
        defaults={"quantity": product.stock},
    )
    return stock


def sync_product_stock(product, quantity=None):
    next_quantity = product.stock if quantity is None else quantity

    if next_quantity < 0:
        raise serializers.ValidationError("Stock quantity cannot be negative.")

    stock, _ = Stock.objects.update_or_create(
        product=product,
        defaults={"quantity": next_quantity},
    )

    if product.stock != next_quantity:
        product.stock = next_quantity
        product.save(update_fields=["stock", "updated_at"])

    return stock


@transaction.atomic
def increase_stock(product, quantity, purchase_price=None):
    if quantity <= 0:
        raise serializers.ValidationError("Quantity must be greater than 0.")

    stock = Stock.objects.select_for_update().get(product=product)
    next_quantity = stock.quantity + quantity

    stock.quantity = next_quantity
    stock.save(update_fields=["quantity", "updated_at"])

    product.stock = next_quantity
    update_fields = ["stock", "updated_at"]

    if purchase_price is not None:
        product.purchase_price = purchase_price
        update_fields.append("purchase_price")

    product.save(update_fields=update_fields)

    return stock


def decrease_stock(product, quantity):
    if quantity <= 0:
        raise serializers.ValidationError("Quantity must be greater than 0.")

    stock = get_or_create_stock(product)
    stock = Stock.objects.select_for_update().get(pk=stock.pk)

    if stock.quantity != product.stock:
        stock.quantity = product.stock
        stock.save(update_fields=["quantity", "updated_at"])

    if stock.quantity < quantity:
        raise serializers.ValidationError(f"Not enough stock for {product.name}")

    next_quantity = stock.quantity - quantity
    stock.quantity = next_quantity
    stock.save(update_fields=["quantity", "updated_at"])

    product.stock = next_quantity
    product.save(update_fields=["stock", "updated_at"])

    return stock
