from django.shortcuts import render

def index(request):
  return render(request, 'index.html')

def handler_404(request, exception):
  return render(request, 'index.html')
