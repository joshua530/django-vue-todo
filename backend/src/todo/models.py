from django.db import models
from django.contrib.auth.models import User

class Todo(models.Model):
  name = models.CharField(max_length=100, null=False)
  done = models.BooleanField(default=False)
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  def __str__(self):
      return 'id=%d - %s - %s - <User id=%s>' %(self.pk, self.name, self.done, self.user.id)
