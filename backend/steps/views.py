from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import StepEntry
from .serializers import StepEntrySerializer

class StepEntryViewSet(viewsets.ModelViewSet):
    queryset = StepEntry.objects.all()
    serializer_class = StepEntrySerializer
    
    @action(detail=False, methods=['post'])
    def sync(self, request):
        today = timezone.now().date()
        steps = request.data.get('steps', 0)
        goal = request.data.get('goal', 10000)
        
        entry, created = StepEntry.objects.update_or_create(
            date=today,
            defaults={'steps': steps, 'goal': goal}
        )
        serializer = self.get_serializer(entry)
        return Response(serializer.data)