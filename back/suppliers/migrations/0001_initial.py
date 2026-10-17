# Generated manually for supplier CRM support.

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Supplier',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('supplier_name', models.CharField(max_length=255)),
                ('company_name', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=15)),
                (
                    'email',
                    models.EmailField(
                        blank=True,
                        max_length=254,
                        null=True,
                    ),
                ),
                (
                    'gst_number',
                    models.CharField(
                        blank=True,
                        max_length=20,
                        null=True,
                    ),
                ),
                (
                    'address',
                    models.TextField(
                        blank=True,
                        null=True,
                    ),
                ),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
