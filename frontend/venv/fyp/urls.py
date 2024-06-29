
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('staff/',include('admins.urls')),
    path('partner/',include('partner.urls')),
    path('',include('accounts.urls')),
    path('team/',include('teams.urls')),
    path('youth/',include('youth.urls')),
]
