from rest_framework import filters, viewsets

from common.permissions import IsAuthenticatedStaff
from .models import Purchase
from .serializers import PurchaseSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.select_related('supplier').prefetch_related(
        'items__product'
    )
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticatedStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'invoice_number',
        'supplier__supplier_name',
        'supplier__company_name',
    ]
