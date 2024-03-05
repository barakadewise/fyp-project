from django.shortcuts import render


#function to load admin dashpanel
def getAdminPanel(request):
    return render(request,'dashboard.html')