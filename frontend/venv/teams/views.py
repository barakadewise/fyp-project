from django.shortcuts import render,redirect
from django.contrib import messages

from Api.api import ApiService

#Api instance
api_service = ApiService()

#retrieve token from the session
def getToken(request):
    if 'token' in request.session['User']:
        return request.session['User']['token']
    return None

def getTeamDashboard(request):
    return render(request,'team-dashboard.html')

def viewYouth(request):
    return render(request,'team-veiwYouth.html')

def viewSession(request):
    print(request.session['User']['token'])
    query= '''
    query {
    getTeamsTraining {
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
    return render(request,'team-session.html', {"sessions":response['data']['getTeamsTraining']})

def createTrainingSession(request):
    #define the mutation 
    mutation ='''
    mutation CreateTraining($input: CreateTrainingInput!) {
        createTraining(createTrainingInput: $input) {
           id
            }
        }

       '''
    if request.method == "POST":
        session = request.POST.get('session')
        duration = request.POST.get('duration')
        startDate = request.POST.get('startDate')
        endDate = request.POST.get('endDate')
        description = request.POST.get('description')
        noOfParticipants = request.POST.get('noOfParticipants')

        variables= {
        "input": {
        "session": session,
        "description": description,
        "duration": duration,
        "startDate":startDate,
        "endDate":endDate,
        "noOfparticipants": int(noOfParticipants)
         }
        }


        try:
            response = api_service.performMuttion(mutation,variables,getToken(request))
            if 'errors' in response:
                print("errors:",response['errors'])
                messages.error(request,response['errors'][0])
                return redirect('teamSession')

            messages.success(request,"Successfully created!")
            return redirect('teamSession')
          
        except Exception as e:
            print("exception throw",response['errors'])
            messages.error(request,"Something Went Wrong!")
            return redirect('teamSession')


def deleteTrainingSession(request):
    mutation='''
        mutation($id:Float!) {
         removeTraining(id: $id) {
         message
         statusCode
         }
         }
       '''
    if request.method=="POST":
        id =int(request.POST.get('id'))
        response = api_service.performMuttion(mutation,{"id":id},getToken(request))

        if 'errors' in response:
            messages.error(request,response['errors'])
            return redirect('teamSession')
        
        print("successfully delated ")
        messages.success(request,"SuccessFully Deleted.")
        return redirect('teamSession')
    

def editSession(request):
     #define the mutation 
    mutation ='''
    mutation UpdateTraining($input: UpdateTrainingInput!,$id:Float!) {
        updateTraining(updateTrainingInput: $input,id:$id) {
            message,
            statusCode
            }
        }

       '''
    if  request.method == "POST":
        id =request.POST.get('editSessionId')
        session = request.POST.get('editSessionName')
        duration = request.POST.get('editSessionDuration')
        startDate = request.POST.get('editStartDate')
        endDate = request.POST.get('editEndDate')
        description = request.POST.get('editSessionDescription')
        noOfParticipants = request.POST.get('editNumberOfParticipants')
        
        variables= {
        "input": {
        "session": session,
        "description": description,
        "duration": duration,
        "startDate":startDate,
        "endDate":endDate,
        "noOfparticipants": int(noOfParticipants)
         },
         "id":int(id)
        }


        try:
            response = api_service.performMuttion(mutation,variables,getToken(request))
            if 'errors' in response:
                print("errors:",response['errors'])
                messages.error(request,response['errors'][0])
                return redirect('teamSession')

            messages.success(request,"Successfully Updated!")
            return redirect('teamSession')
          
        except Exception as e:
            print("exception throw",response['errors'])
            messages.error(request,"Something Went Wrong!")
            return redirect('teamSession')
    # return redirect('teamSession')