from rest_framework import filters, viewsets

from common.permissions import IsAuthenticatedStaff
from .models import Supplier
from .serializers import SupplierSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticatedStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'supplier_name',
        'company_name',
        'phone',
    ]
