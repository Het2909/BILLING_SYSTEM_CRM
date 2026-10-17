from django.contrib import admin

from .models import Purchase, PurchaseItem


class PurchaseItemInline(admin.TabularInline):
    model = PurchaseItem
    extra = 0
    readonly_fields = ('subtotal',)


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = (
        'invoice_number',
        'supplier',
        'total_amount',
        'created_at',
    )
    search_fields = (
        'invoice_number',
        'supplier__supplier_name',
        'supplier__company_name',
    )
    list_filter = ('created_at',)
    inlines = [PurchaseItemInline]


@admin.register(PurchaseItem)
class PurchaseItemAdmin(admin.ModelAdmin):
    list_display = (
        'purchase',
        'product',
        'quantity',
        'purchase_price',
        'subtotal',
    )
    search_fields = ('purchase__invoice_number', 'product__name')
