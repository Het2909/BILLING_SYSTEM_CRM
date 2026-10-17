from django.urls import path

from .views import (
    DashboardSummaryView,
    RecentTransactionsView,
    LowStockView,
    SalesAnalyticsView,
)


urlpatterns = [
    path('dashboard/summary/', DashboardSummaryView.as_view()),
    path('dashboard/recent-transactions/', RecentTransactionsView.as_view()),
    path('dashboard/low-stock/', LowStockView.as_view()),
    path('sales/analytics/', SalesAnalyticsView.as_view()),
]
