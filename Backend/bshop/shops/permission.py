from rest_framework import permissions


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == "POST":
            return obj.user == request.user
        if request.method == "PUT" or request.method == "DELETE":
            return obj.shopID.user == request.user
        if request.method == "GET":  # allow any
            return True


class IsAuthor(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == "GET":
            return True
        return obj.user == request.user
