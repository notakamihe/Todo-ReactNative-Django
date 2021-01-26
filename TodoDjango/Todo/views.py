from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from .serializers import *

# Create your views here.


@csrf_exempt
def task_api(request, task_desc=""):
    if request.method == "GET":
        print("Get request")

        serializer = TaskSerializer(Task.objects.all(), many=True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == "POST":
        print("Post request")

        data = JSONParser().parse(request)
        serializer = TaskSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse("Post successful", safe=False)

    if request.method == "DELETE":
        task = Task.objects.get(description=task_desc)
        task.delete()
        return JsonResponse("Delete successful", safe=False)
