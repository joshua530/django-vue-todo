from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from . import views

urlpatterns = [
  # todos
  path('todos/', views.UserTodoListView.as_view(), name='view_all_user_todos'),
  path('todo/', views.TodoCreationView.as_view(), name='create_todo'),
  path('todo/<int:pk>/', views.TodoUpdateView.as_view(), name='change_todo'),
  # authentication
  path('users/login/', jwt_views.TokenObtainPairView.as_view(), name='login_view'),
  path('users/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='refresh_token_view'),
  path('users/logout/', views.logout_user, name='logout_view'),
  # sign in
  path('users/sign-up/', views.UserCreationView.as_view(), name='sign_up'),
]


'''
POST /api/v1/users/logout
POST /api/v1/users/login

GET (all user todos) /api/v1/todo/users/<id>
PUT (update todo) /api/v1/todo/<id>
DELETE (delete todo item) /api/v1/todo/<id>
POST (CREATE todo) /api/v1/todo

'''
