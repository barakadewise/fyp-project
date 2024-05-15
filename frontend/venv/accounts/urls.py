from django.urls import path
from .import views


urlpatterns = [
   path('',views.loginPage,name='login'),
   path('signup',views.signupPage,name='signup'),
   path('complete-profile/<int:account_id>',views.completeProfile,name="complete-profile"),
   path('logout',views.logout,name='logout')
   
]


