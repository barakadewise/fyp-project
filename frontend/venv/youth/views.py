from django.shortcuts import render

from Api.api import ApiService

#Api instance
api_service = ApiService() 
def getToken(request):
    token = request.session['User']['token']
    print(token)
    if not token:
        return None
    return token
    

def youthDashboard(request):
     querySession='''
     query {
      findAllTraining {
      id
      }
    }
    '''
     queryProjects='''
         query {
         findAllProjects {
          id
           }
          }

       '''
  
     getSession = api_service.performQuery(querySession,api_service.getCsrfToken(request),getToken(request))
     getProjects= api_service.performQuery(queryProjects,api_service.getCsrfToken(request))

     context={
        "projects":len(getProjects),
        "sessions":len(getSession)
    }
     return render(request,'youth-dashboard.htm',context)

def youthViewSession(request):
    #perfomr query 
    query= '''
    query {
    findAllTraining{
    id
    session
    description
    startDate
    duration
    endDate
    noOfparticipants
     }
    }
    '''

    response = api_service.performQuery(query,api_service.getCsrfToken(request),getToken(request))
    return render(request,'youth-sessions.html',{"sessions":response['data']['findAllTraining']})
# return render(request,'team-session.html', )


def youthViewProjects(request):
    return render(request,'youth-projects.html')


def youthApplication(request):
    return render(request,'youth-application.html')

