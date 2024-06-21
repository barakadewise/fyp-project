from django.urls import path 
from .import views

urlpatterns=[
    path('dashboard',views.partnerDashbord,name='partnerDashboard'),
    path('projects',views.viewProjects,name='partnerViewProject'),
    path('opportunites',views.viewOpportunities,name='partnerViewOpportunities'),
    path('fundProject',views.fundProject,name='fundproject')
]