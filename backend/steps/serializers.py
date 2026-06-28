from rest_framework import serializers
from .models import StepEntry

class StepEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = StepEntry
        fields = '__all__'