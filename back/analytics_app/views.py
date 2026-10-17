from django.db.models import F, Sum, Count
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime, timedelta
from django.db.models.functions import TruncHour, TruncDate
import json

from common.permissions import IsAuthenticatedStaff
from customers.models import Customer
from invoices.models import Invoice
from products.models import Product


class DashboardSummaryView(APIView):

    permission_classes = [IsAuthenticatedStaff]

    def get(self, request):
        today = timezone.localdate()

        todays_sales = (
            Invoice.objects
            .filter(created_at__date=today)
            .aggregate(total=Sum('grand_total'))
            .get('total') or 0
        )

        return Response({
            'todays_sales': todays_sales,
            'products': Product.objects.count(),
            'customers': Customer.objects.count(),
            'low_stock': Product.objects.filter(
                stock__lt=10
            ).count(),
        })


class SalesAnalyticsView(APIView):

    permission_classes = [IsAuthenticatedStaff]

    def get(self, request):
        period = request.query_params.get('period', 'week')
        
        if period == 'today':
            data = self._get_today_analytics()
        elif period == 'week':
            data = self._get_week_analytics()
        elif period == 'month':
            data = self._get_month_analytics()
        else:
            data = self._get_week_analytics()
        
        return Response(data)

    def _get_today_analytics(self):
        """Get hourly sales data for today"""
        today = timezone.localdate()
        today_start = timezone.make_aware(datetime.combine(today, datetime.min.time()))
        today_end = timezone.make_aware(datetime.combine(today, datetime.max.time()))
        
        # Get hourly data
        hourly_data = (
            Invoice.objects
            .filter(created_at__range=[today_start, today_end])
            .annotate(hour=TruncHour('created_at'))
            .values('hour')
            .annotate(
                sales=Count('id'),
                revenue=Sum('grand_total'),
                profit=Sum('grand_total') - Sum('subtotal')
            )
            .order_by('hour')
        )
        
        # Create hourly labels (7 AM to 7 PM)
        hours = []
        labels = ['7 AM', '9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM']
        
        for i, label in enumerate(labels):
            hour_num = 7 + (i * 2)
            hour_start = timezone.make_aware(datetime.combine(today, datetime.min.time().replace(hour=hour_num)))
            hour_end = hour_start + timedelta(hours=1)
            
            data_point = next(
                (d for d in hourly_data if d['hour'] and d['hour'] >= hour_start and d['hour'] < hour_end),
                None
            )
            
            hours.append({
                'label': label,
                'sales': int(data_point['sales'] or 0) if data_point else 0,
                'revenue': float(data_point['revenue'] or 0) if data_point else 0,
                'profit': float(data_point['profit'] or 0) if data_point else 0,
            })
        
        return hours

    def _get_week_analytics(self):
        """Get daily sales data for current week"""
        today = timezone.localdate()
        # Get start of week (Monday)
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=7)
        
        week_start_dt = timezone.make_aware(datetime.combine(week_start, datetime.min.time()))
        week_end_dt = timezone.make_aware(datetime.combine(week_end, datetime.max.time()))
        
        # Get daily data
        daily_data = (
            Invoice.objects
            .filter(created_at__range=[week_start_dt, week_end_dt])
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(
                sales=Count('id'),
                revenue=Sum('grand_total'),
                profit=Sum('grand_total') - Sum('subtotal')
            )
            .order_by('date')
        )
        
        # Create daily labels
        days = []
        day_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
        for i, label in enumerate(day_labels):
            current_date = week_start + timedelta(days=i)
            
            data_point = next(
                (d for d in daily_data if d['date'] == current_date),
                None
            )
            
            days.append({
                'label': label,
                'sales': int(data_point['sales'] or 0) if data_point else 0,
                'revenue': float(data_point['revenue'] or 0) if data_point else 0,
                'profit': float(data_point['profit'] or 0) if data_point else 0,
            })
        
        return days

    def _get_month_analytics(self):
        """Get weekly sales data for current month"""
        today = timezone.localdate()
        # Get start of month
        month_start = today.replace(day=1)
        # Get start of next month, then subtract a day to get end of current month
        if today.month == 12:
            month_end = month_start.replace(year=today.year + 1, month=1) - timedelta(days=1)
        else:
            month_end = month_start.replace(month=today.month + 1) - timedelta(days=1)
        
        month_start_dt = timezone.make_aware(datetime.combine(month_start, datetime.min.time()))
        month_end_dt = timezone.make_aware(datetime.combine(month_end, datetime.max.time()))
        
        # Get data for each week
        weeks = []
        week_labels = ['W1', 'W2', 'W3', 'W4', 'W5']
        
        for week_num, label in enumerate(week_labels, 1):
            week_start = month_start + timedelta(days=(week_num - 1) * 7)
            week_end = min(week_start + timedelta(days=7), month_end + timedelta(days=1))
            
            week_start_dt = timezone.make_aware(datetime.combine(week_start, datetime.min.time()))
            week_end_dt = timezone.make_aware(datetime.combine(week_end, datetime.max.time()))
            
            week_data = (
                Invoice.objects
                .filter(created_at__range=[week_start_dt, week_end_dt])
                .aggregate(
                    sales=Count('id'),
                    revenue=Sum('grand_total'),
                    profit=Sum('grand_total') - Sum('subtotal')
                )
            )
            
            weeks.append({
                'label': label,
                'sales': int(week_data['sales'] or 0),
                'revenue': float(week_data['revenue'] or 0),
                'profit': float(week_data['profit'] or 0),
            })
        
        return weeks


class RecentTransactionsView(APIView):

    permission_classes = [IsAuthenticatedStaff]

    def get(self, request):
        transactions = (
            Invoice.objects
            .select_related('customer')
            .order_by('-created_at')[:8]
        )

        data = []
        for invoice in transactions:
            data.append({
                'invoice': f"INV-{invoice.id}",
                'customer': invoice.customer.name if invoice.customer else 'Walk-in Customer',
                'amount': float(invoice.grand_total),
                'method': invoice.get_payment_method_display(),
                'status': 'Paid',
                'date': invoice.created_at.isoformat(),
            })

        return Response(data)


class LowStockView(APIView):

    permission_classes = [IsAuthenticatedStaff]

    def get(self, request):
        products = (
            Product.objects
            .filter(stock__lt=10)
            .order_by('stock')[:5]
        )

        data = []
        for product in products:
            severity = 'critical' if product.stock <= 3 else 'warning'
            data.append({
                'name': product.name,
                'quantity': f"{int(product.stock)} left",
                'severity': severity,
            })

        return Response(data)
