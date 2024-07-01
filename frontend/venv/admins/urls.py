from django.urls import path 
from .import views

urlpatterns=[
    path('admin',views.getAdminPanel,name='adminPanel'),
    path('viewStaffs',views.viewStaff,name='viewStaffs'),
    path('createStaff',views.createStaff,name='createStaff'),
    path('createPartner',views.createPartner,name='createPartner'),
    path('viewinstallments',views.viewInstallments,name='viewInstallments'),
    path('viewPartners',views.viewPartners,name='viewPartners'),
    path('createYouth',views.createYouth,name='createYouth'),
    path('viewYouth',views.viewYouth,name='viewYouth'),
    path('deleteYouthById',views.deleteYouthById,name='deleteYouthById'),
    path('deletePartnerById',views.deletePartenerById,name="deletePartnerById"),
    path('deleteOpportunityById"',views.deleteOpporrtunityById,name="deleteOpportunityById"),
    path('deleteTeamById',views.deleteTeamById,name='deleteTeamById'),
    path('viewProjects',views.viewProjects,name='viewProjects'),
    path('createProject',views.createProject,name='createProject'),
    path('viewOpportunities',views.viewOpportunities,name='viewOpportunities'),
    path('createOpportunity',views.createOpportunity,name='createOpportunity'),
    path('viewTeams',views.viewTeams,name="viewTeams"),
    path('createTeam',views.createTeam,name="createTeam"),
    path('editYouthById',views.editYouthById,name="editYouthById"),
    path('editPartnerById',views.editPartner,name="editPartnerById"),
    path('editTeamById',views.editTeam,name="editTeamById"),
    path('training-sessions',views.viewSession,name="viewSessions"),
    path('admin-edit-session',views.adminEditSession,name='adminEditSession'),

]