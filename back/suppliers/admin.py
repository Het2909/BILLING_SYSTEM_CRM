from django.contrib import admin

from .models import Supplier


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = (
        'supplier_name',
        'company_name',
        'phone',
        'gst_number',
        'created_at',
    )
    search_fields = (
        'supplier_name',
        'company_name',
        'phone',
        'gst_number',
    )
    list_filter = ('created_at',)
