from django.urls import path 
from .import views

urlpatterns=[
 path('dashbaord',views.getTeamDashboard,name='teamDashboard'),
 path('youth',views.viewYouth,name='teamViewYouth'),
 path('session',views.viewSession,name='teamSession'),
 path('createSession',views.createTrainingSession,name="createTrainingSession"),
 path('deleteSession',views.deleteTrainingSession,name="deleteSessionById"),
]