from django.urls import path 
from .import views

urlpatterns=[
    path('',views.getAdminPanel,name='adminPanel'),
    path('createAdmin',views.createAdmin,name='createAdmin'),
    path('createPartner',views.createPartner,name='createPartner'),
    path('viewPartners',views.viewPartners,name='viewPartners')
]