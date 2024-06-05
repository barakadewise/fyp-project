from django.shortcuts import render

# Create your views here.

def partnerDashbord(request):
    return render(request,'partner-dashboard.html')