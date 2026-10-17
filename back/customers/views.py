from rest_framework import viewsets, filters

from common.permissions import IsAuthenticatedStaff
from .models import Customer
from .serializers import CustomerSerializer


class CustomerViewSet(viewsets.ModelViewSet):

    queryset = Customer.objects.all().order_by('-id')

    serializer_class = CustomerSerializer

    permission_classes = [IsAuthenticatedStaff]

    filter_backends = [filters.SearchFilter]

    search_fields = [
        'name',
        'phone',
    ]
