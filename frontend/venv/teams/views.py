from django.shortcuts import render


def getTeamDashboard(request):
    return render(request,'team-dashboard.html')

def viewYouth(request):
    return render(request,'team-veiwYouth.html')

def viewSession(request):
    return render(request,'team-session.html')