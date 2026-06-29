from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.contrib.auth.models import User
from .models import StepEntry
from .serializers import StepEntrySerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class StepEntryViewSet(viewsets.ModelViewSet):
    serializer_class = StepEntrySerializer
    
    def get_queryset(self):
        return StepEntry.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def sync(self, request):
        today = timezone.now().date()
        steps = request.data.get('steps', 0)
        goal = request.data.get('goal', 10000)
        
        entry, created = StepEntry.objects.update_or_create(
            user=request.user,
            date=today,
            defaults={'steps': steps, 'goal': goal}
        )
        serializer = self.get_serializer(entry)
        return Response(serializer.data)