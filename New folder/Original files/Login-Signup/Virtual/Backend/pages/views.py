from django.shortcuts import render, redirect, get_object_or_404
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.models import User, auth
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages

# Create your views here.

def index(request):
    return render(request, 'index.html')

def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['Pass']
        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            # FIX: Use named URL redirects instead of raw path strings
            if request.user.is_staff:
                return redirect('index')
            else:
                return redirect('index')
        else:
            messages.info(request, 'Invalid username or password')
            return redirect('login')
    return render(request, 'login.html')

def signup(request): 
    if request.method == 'POST':
        firstName = request.POST['Fname']
        lastName = request.POST['Lname']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['Pass']
        cPassword = request.POST['confirm']
        gender = request.POST['gender']
        role = request.POST['role']

        if len(password) < 6:
            messages.info(request, "Password must be at least 6 characters")
            return redirect('SignUp')

        if password == cPassword:
            if User.objects.filter(email=email).exists():
                messages.info(request, 'Email Already Used')
                return redirect('SignUp')
            elif User.objects.filter(username=username).exists():
                messages.info(request, 'Username Already Exists')
                return redirect('SignUp')
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                user.first_name = firstName
                user.last_name = lastName
                if role == 'admin':
                    user.is_staff = True
                user.save()
                return redirect('login')
        else:
            messages.info(request, 'Passwords does not match')
            return redirect('SignUp')
    else:
        return render(request, 'SignUp.html')