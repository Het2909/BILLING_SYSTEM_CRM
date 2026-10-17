from rest_framework import serializers
from django.db import transaction

from .models import Invoice, InvoiceItem

from inventory.services import decrease_stock


class InvoiceItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    class Meta:
        model = InvoiceItem
        fields = '__all__'
        read_only_fields = (
            'invoice',
            'price',
            'tax_percent',
            'total',
        )
        extra_kwargs = {
            'product': {
                'required': True,
                'allow_null': False,
            },
            'quantity': {
                'required': True,
                'min_value': 1,
            },
        }


class InvoiceSerializer(serializers.ModelSerializer):

    items = InvoiceItemSerializer(many=True)
    customer_name = serializers.CharField(
        source='customer.name',
        read_only=True
    )
    customer_phone = serializers.CharField(
        source='customer.phone',
        read_only=True
    )

    class Meta:
        model = Invoice
        fields = '__all__'

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('Add at least one invoice item.')

        return items

    def validate_discount(self, discount):
        if discount < 0:
            raise serializers.ValidationError('Discount cannot be negative.')

        return discount

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop('items')

        invoice = Invoice.objects.create(**validated_data)

        subtotal = 0
        tax_amount = 0

        for item_data in items_data:

            product = item_data['product']

            quantity = item_data['quantity']

            decrease_stock(product, quantity)

            price = product.selling_price

            item_total = price * quantity

            tax_percent = product.gst_percentage

            item_tax = (
                item_total * tax_percent
            ) / 100

            InvoiceItem.objects.create(
                invoice=invoice,
                product=product,
                quantity=quantity,
                price=price,
                tax_percent=tax_percent,
                total=item_total + item_tax
            )

            subtotal += item_total

            tax_amount += item_tax

        grand_total = (
            subtotal +
            tax_amount -
            invoice.discount
        )

        invoice.subtotal = subtotal
        invoice.tax_amount = tax_amount
        invoice.grand_total = grand_total

        invoice.save()

        return invoice
