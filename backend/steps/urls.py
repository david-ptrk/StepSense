from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StepEntryViewSet, RegisterView

router = DefaultRouter()
router.register(r'steps', StepEntryViewSet, basename='steps')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
]