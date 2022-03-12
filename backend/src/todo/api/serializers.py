from rest_framework import serializers
from todo.models import Todo
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class NullSerializer(serializers.Serializer):
  """For views that don't require a serializer"""
  pass

class TodoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Todo
    fields = ['name', 'done', 'id']

class TodoCreationSerializer(serializers.Serializer):
  name = serializers.CharField()

  def validate(self, data):
    name = data['name']
    name.strip()
    if (name == ''):
      raise serializers.ValidationError('Todo name cannot be empty')
    return data

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['username', 'email', 'password']

  def validate(self, data):
    try:
      email = data['email']
      email = email.strip()
      if (len(email) == 0):
        raise serializers.ValidationError('Email cannot be empty')
      password = data['password'].strip()
      if len(password) < 8:
        raise serializers.ValidationError('Password should be at least 5 characters long')
      password = make_password(password)
    except KeyError:
      raise serializers.ValidationError('Email cannot be empty')
    user_with_equiv_email = User.objects.filter(email=email)
    if (len(user_with_equiv_email) != 0):
      raise serializers.ValidationError('User with that email already exists')
    data['email'] = email
    data['password'] = password
    return data
