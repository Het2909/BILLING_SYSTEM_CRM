from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.contrib import admin

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/', include('products.urls')),
    path('api/', include('invoices.urls')),
    path('api/', include('customers.urls')),
    path('api/', include('purchases.urls')),
    path('api/', include('suppliers.urls')),
    path('api/', include('analytics_app.urls')),
    path('admin/', admin.site.urls),
]
