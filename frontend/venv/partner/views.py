from django.shortcuts import render


def partnerDashbord(request):
    return render(request,'partner-dashboard.html')

def viewProjects(request):
    return render(request,'partner-projects.html')

def viewOpportunities(request):
    return render(request,'partner-opportunities.html')