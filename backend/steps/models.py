from django.db import models
from django.contrib.auth.models import User

class StepEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='steps')
    date = models.DateField()
    steps = models.IntegerField(default=0)
    goal = models.IntegerField(default=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date}: {self.steps} steps"