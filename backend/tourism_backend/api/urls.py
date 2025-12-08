from django.urls import path, include
from rest_framework.routers import DefaultRouter
#from .views import AttractionViewSet, ReviewViewSet, RegisterView ,RouteViewSet, CategoryViewSet, RegionViewSet, UserProfileViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    AttractionViewSet, ReviewViewSet, RegisterView, RouteViewSet, 
    CategoryViewSet, RegionViewSet, UserProfileViewSet, AdminStatsView
)
router = DefaultRouter()
router.register(r'attractions', AttractionViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'regions', RegionViewSet)
router.register(r'profiles', UserProfileViewSet, basename='userprofile')

urlpatterns = [
    path('', include(router.urls)),
    # Эндпоинты для аутентификации (Login)
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
]