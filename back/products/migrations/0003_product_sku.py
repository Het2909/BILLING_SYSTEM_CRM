# Generated manually to restore SKU support for products.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_rename_tax_percent_product_gst_percentage_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='sku',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]
