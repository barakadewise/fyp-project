from django.urls import path 
from .import views

urlpatterns=[
    path('dashaboard',views.youthDashboard,name="youthDashboard"),
    path('projects',views.youthViewProjects,name="youthViewProjects"),
    path('sessions',views.youthViewSession,name="youthViewSessions"),
    path('applications',views.youthApplication,name="youthApplication"),
    path('applyTraining/<int:id>',views.applyTraining,name="applyTraining")
]