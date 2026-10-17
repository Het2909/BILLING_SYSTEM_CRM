from rest_framework import viewsets, filters

from common.permissions import IsAuthenticatedStaff
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all().order_by('name')

    serializer_class = CategorySerializer

    permission_classes = [IsAuthenticatedStaff]


class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all().order_by('-id')

    serializer_class = ProductSerializer

    permission_classes = [IsAuthenticatedStaff]

    filter_backends = [filters.SearchFilter]

    search_fields = [
        'name',
        'barcode',
        'sku',
    ]
