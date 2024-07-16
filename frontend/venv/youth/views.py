from django.shortcuts import render,redirect
from django.contrib import messages
from django.http import JsonResponse,HttpResponse
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

     total_session =getSession['data']['findAllTraining']
     total_projects=getProjects['data']['findAllProjects']
     context={
        "projects":len(total_projects),
        "sessions":len(total_session)
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
    print(response)
    return render(request,'youth-sessions.html',{"sessions":response['data']['findAllTraining']})



def youthViewProjects(request):
    return render(request,'youth-projects.html')


def youthApplication(request):

    #fetch the application 
    query ='''
      query {
    getCurrentYouthAplication {
    id
     isAproved
    youthId
    trainingId
    youthName
    trainingName
    }
    }

    '''
   
    application = api_service.performQuery(query,api_service.getCsrfToken(request),api_service.getToken(request))
    data = application['data']['getCurrentYouthAplication']
    context={
        "applications":[]
      }
    if data:
        context={
        "applications":[i for i in  data ]
      }

    print(context)
    return render(request,'youth-application.html',context)

def applyTraining(request,id):
    print("The id received is :",id)
    mutation ='''
    mutation($trainingId:Float!){
    trainingApplication(createTrainingInput: { trainingId:$trainingId }) {
    id
      }
    }
    '''
    #graphql query 
    aplication =api_service.performMuttion(mutation,{"trainingId":int(id)},api_service.getToken(request))
    if 'errors' in aplication:
        err =aplication['errors'][0]['message']
        print(aplication)
        messages.error(request,err)
        return redirect('youthViewSessions')
        
    messages.success(request,"Application Made Successfully!")
    return redirect('youthApplication')
    