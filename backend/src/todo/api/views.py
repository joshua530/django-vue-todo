from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from todo.models import Todo

from .serializers import TodoCreationSerializer, TodoSerializer, UserSerializer, NullSerializer


############### utility functions ###############
def user_id_from_request(request):
    auth = request.headers['Authorization']
    # auth comes in the form of 'Bearer <token>', split using
    # the space
    token = auth.split(' ')[1]
    return user_id_from_auth_token(token)

def user_id_from_auth_token(auth_token):    
    access_token = AccessToken(auth_token)
    return access_token['user_id']

############### utility classes ###############
class UserCreatedResponseRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = data
        fields = ['username','email','password']
        for field in fields:
            if field in data.keys():
                response = {"message": data[field]}
            
        return super().render(response, accepted_media_type, renderer_context)


############### views ###############
class UserCreationView(generics.CreateAPIView):
    serializer_class = UserSerializer
    renderer_classes = [UserCreatedResponseRenderer, BrowsableAPIRenderer]
    # TODO remove after verification that users are created without issues
    # def perform_create(self, serializer):
    #     email = serializer.validated_data["email"]
    #     password = serializer.validated_data["password"]
    #     username = serializer.validated_data["username"]
    #     user = User(email=email, password=password, username=username)
    #     return user.save()


class UserTodoListView(generics.ListAPIView):
    queryset = Todo.objects.all()

    def get(self, request, *args, **kwargs):
        user_id = user_id_from_request(request)
        try:
            user = User.objects.get(id=user_id)
            items = Todo.objects.filter(user=user)

            tmp = []
            for item in items:
                tmp.append(TodoSerializer(item).data)
        except ObjectDoesNotExist as e:
            tmp = []
        return Response(tmp)

class TodoCreationView(generics.CreateAPIView):
    serializer_class = TodoCreationSerializer
    queryset = None
        
    def post(self, request, *args, **kwargs):
        user_id = user_id_from_request(request)
        serializer = TodoCreationSerializer(request.data)
        if not serializer.is_valid:
            return Response(serializer.errors)
        user = User.objects.filter(id=user_id)
        if len(user) != 1:
            raise APIException("Invalid user", 400)
        todo = Todo(user=user[0], name=serializer.data.get('name'))
        todo.save()
        serializer = TodoSerializer(todo)
        return Response(serializer.data)


class TodoUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = NullSerializer

    def get_todo_item(self, request, *args, **kwargs) -> Todo:
        try:
            id = self.kwargs["pk"]
            user_id = user_id_from_request(request)
        except KeyError:
            raise APIException("Bad request", 400)

        user = User.objects.filter(id=user_id)
        if len(user) != 1:
            raise APIException("Invalid user id", 400)
        todo = Todo.objects.filter(id=id)
        if len(todo) != 1:
            raise APIException("Todo item not found", 400)
        todo = todo[0]
        return todo

    def put(self, request, *args, **kwargs):
        todo = self.get_todo_item(request, args, kwargs)
        user_id = user_id_from_request(request)

        if todo.user.id != user_id:
            data = {'error': 'Todo item does not belong to current user'}
            response = Response(data, status=status.HTTP_403_FORBIDDEN)
        else:
            todo.done = not todo.done
            todo.save()
            response = Response(TodoSerializer(todo).data)
        return response

    def delete(self, request, *args, **kwargs):
        user_id = user_id_from_request(request)
        todo = self.get_todo_item(request, args, kwargs)
        if todo.user.id != user_id:
            data = {'error': 'Todo item does not belong to current user'}
            response = Response(data, status=status.HTTP_403_FORBIDDEN)
        else:
            todo.delete()
            response = Response({'success': 'Item deleted successfully'}, status=status.HTTP_200_OK)
        return response


# logout user
@api_view(["POST"])
def logout_user(request):
    """Blacklist the refresh token"""
    refresh_tok = request.data["refresh"]
    token = RefreshToken(refresh_tok)
    token.blacklist()
    response = Response("Logged out successfully", status=status.HTTP_200_OK)
    response["Access-control-allow-origin"] = "http://localhost:8080"
    return response
