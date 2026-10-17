from rest_framework import viewsets

from common.permissions import IsAuthenticatedStaff
from .models import Invoice
from .serializers import InvoiceSerializer


class InvoiceViewSet(viewsets.ModelViewSet):

    queryset = Invoice.objects.select_related('customer').prefetch_related(
        'items__product'
    ).order_by('-id')

    serializer_class = InvoiceSerializer

    permission_classes = [IsAuthenticatedStaff]
