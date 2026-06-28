from django.db import models

class StepEntry(models.Model):
    date = models.DateField()
    steps = models.IntegerField(default=0)
    goal = models.IntegerField(default=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.date}: {self.steps} steps"