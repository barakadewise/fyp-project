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
    return render(request,'youth-dashboard.htm')

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


def youthForProject(request):
    pass

