class CustomHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        uri = request.get_full_path()
        response = self.get_response(request)
        allowed_headers = ["Content-type", "Authorization"]
        authorization_routes = ["/api/v1/users/token/refresh/", "/api/v1/todos/", "/api/v1/todo/"]
        if request.method == "OPTIONS":
          response.headers["Access-control-allow-methods"] = "PUT, DELETE"
        response.headers["Access-control-allow-origin"] = "http://localhost:8080"
        response.headers["Access-control-allow-headers"] = ", ".join(allowed_headers)

        return response
