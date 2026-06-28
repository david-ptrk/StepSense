from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StepEntryViewSet

router = DefaultRouter()
router.register(r'steps', StepEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]