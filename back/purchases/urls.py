from rest_framework.routers import DefaultRouter

from .views import PurchaseViewSet

router = DefaultRouter()

router.register('purchases', PurchaseViewSet)

urlpatterns = router.urls
