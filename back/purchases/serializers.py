from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from inventory.services import get_or_create_stock, increase_stock
from products.models import Product
from suppliers.models import Supplier

from .models import Purchase, PurchaseItem


class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = PurchaseItem
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'purchase_price',
            'subtotal',
        ]
        read_only_fields = ['subtotal']


class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True)
    supplier_name = serializers.CharField(
        source='supplier.supplier_name',
        read_only=True
    )
    supplier_company = serializers.CharField(
        source='supplier.company_name',
        read_only=True
    )

    class Meta:
        model = Purchase
        fields = [
            'id',
            'supplier',
            'supplier_name',
            'supplier_company',
            'invoice_number',
            'total_amount',
            'created_at',
            'items',
        ]
        read_only_fields = ['total_amount', 'created_at']

    def validate_supplier(self, supplier):
        if not Supplier.objects.filter(id=supplier.id).exists():
            raise serializers.ValidationError('Selected supplier does not exist.')

        return supplier

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('Add at least one purchase item.')

        for item in items:
            if item['quantity'] <= 0:
                raise serializers.ValidationError('Quantity must be greater than 0.')

            if item['purchase_price'] <= 0:
                raise serializers.ValidationError(
                    'Purchase price must be greater than 0.'
                )

        return items

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        purchase = Purchase.objects.create(**validated_data)
        total_amount = Decimal('0.00')

        for item_data in items_data:
            product = Product.objects.select_for_update().get(
                id=item_data['product'].id
            )
            get_or_create_stock(product)
            quantity = item_data['quantity']
            purchase_price = item_data['purchase_price']
            subtotal = purchase_price * quantity

            PurchaseItem.objects.create(
                purchase=purchase,
                product=product,
                quantity=quantity,
                purchase_price=purchase_price,
                subtotal=subtotal,
            )

            increase_stock(
                product=product,
                quantity=quantity,
                purchase_price=purchase_price,
            )

            total_amount += subtotal

        purchase.total_amount = total_amount
        purchase.save(update_fields=['total_amount'])

        return purchase
