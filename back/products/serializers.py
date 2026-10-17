from rest_framework import serializers
from .models import Product, Category
from inventory.services import sync_product_stock


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.SerializerMethodField()

    stock_quantity = serializers.SerializerMethodField()

    def get_category_name(self, obj):
        if not obj.category:
            return ""

        try:
            category = Category.objects.get(id=obj.category)
            return category.name
        except (Category.DoesNotExist, ValueError, TypeError):
            return obj.category

    def get_stock_quantity(self, obj):
        return obj.stock

    class Meta:
        model = Product
        fields = '__all__'

    def validate(self, attrs):
        stock = attrs.get('stock', getattr(self.instance, 'stock', 0))
        minimum_stock = attrs.get(
            'minimum_stock',
            getattr(self.instance, 'minimum_stock', 0)
        )
        purchase_price = attrs.get(
            'purchase_price',
            getattr(self.instance, 'purchase_price', 0)
        )
        selling_price = attrs.get(
            'selling_price',
            getattr(self.instance, 'selling_price', 0)
        )
        gst_percentage = attrs.get(
            'gst_percentage',
            getattr(self.instance, 'gst_percentage', 0)
        )

        if stock < 0:
            raise serializers.ValidationError({
                'stock': 'Stock quantity cannot be negative.'
            })

        if minimum_stock < 0:
            raise serializers.ValidationError({
                'minimum_stock': 'Minimum stock cannot be negative.'
            })

        if purchase_price < 0:
            raise serializers.ValidationError({
                'purchase_price': 'Purchase price cannot be negative.'
            })

        if selling_price < 0:
            raise serializers.ValidationError({
                'selling_price': 'Selling price cannot be negative.'
            })

        if gst_percentage < 0:
            raise serializers.ValidationError({
                'gst_percentage': 'GST percentage cannot be negative.'
            })

        return attrs

    def create(self, validated_data):
        product = super().create(validated_data)
        sync_product_stock(product)
        return product

    def update(self, instance, validated_data):
        product = super().update(instance, validated_data)
        sync_product_stock(product)
        return product
