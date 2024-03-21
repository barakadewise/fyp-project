from django.urls import path 
from .import views

urlpatterns=[
    path('',views.getAdminPanel,name='adminPanel'),
    path('viewAdmins',views.viewAdmin,name='viewAdmins'),
    path('createAdmin',views.createAdmin,name='createAdmin'),
    path('createPartner',views.createPartner,name='createPartner'),
    path('viewPartners',views.viewPartners,name='viewPartners'),
    path('createYouth',views.createYouth,name='createYouth'),
    path('viewYouth',views.viewYouth,name='viewYouth'),
    path('deleteYouthById',views.deleteYouthById,name='deleteYouthById'),
    path('viewProjects',views.viewProjects,name='viewProjects'),
    path('createProject',views.createProject,name='createProject')
    
]