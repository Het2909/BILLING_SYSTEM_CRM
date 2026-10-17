from django.contrib import admin

from .models import Invoice, InvoiceItem


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0
    readonly_fields = (
        "product",
        "quantity",
        "price",
        "tax_percent",
        "total",
    )
    can_delete = False


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "payment_method",
        "subtotal",
        "tax_amount",
        "discount",
        "grand_total",
        "created_at",
    )
    list_filter = ("payment_method", "created_at")
    search_fields = ("id", "customer__name", "customer__phone")
    readonly_fields = (
        "subtotal",
        "tax_amount",
        "discount",
        "grand_total",
        "created_at",
    )
    inlines = [InvoiceItemInline]


@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = (
        "invoice",
        "product",
        "quantity",
        "price",
        "tax_percent",
        "total",
    )
    search_fields = ("invoice__id", "product__name")
