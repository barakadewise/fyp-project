

from django.shortcuts import render,redirect
from reportlab.lib.utils import ImageReader
from Api.api import ApiService
from django.contrib import messages
from shared.roles_enum import Roles, Status
from django.http import JsonResponse
from django.http import HttpResponse

#report lib 
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from io import BytesIO



#Api instance
api_service = ApiService()
roles= Roles
status =Status

#function to load admin dashpanel
def getAdminPanel(request):
    csrf_token =api_service.getCsrfToken(request)
    
    # all admin query
    queryStaff ='''
            query{
             findAllStaffs{
              id,
             }
         }
       '''
    
    # all youth query
    queryYouth ='''
         query{
         findAllYouth{
          id
           }
         }
        '''
    
    # all projects
    queryProjects='''
         query {
         findAllProjects {
          id
           }
          }

       '''
    
    # query teams
    queryTeams='''
         query {
        findAllTeams {
        id
        }
       }
   '''
    #query project
    queryPartners='''
         query {
         findAllPartners {
          id
         }
         }

        '''
    #query opportunities
    queryOpportunities='''
        query {
          findAllOpportunities {
         id
        }
       }

     '''
    currentlyCreatedUser='''
      query{
    curentlyCreatedUser{
    id,
    email,
    role,
    createdAt,
  
     }
    }

     '''
    
    queryTrainingSession='''
    query {
    findAllTraining{
    id
    }
    }
   '''
    print(request.session['User']['token'])
    try:
        allAStaff =api_service.performQuery(queryStaff,csrf_token)
        allYouth =api_service.performQuery(queryYouth,csrf_token)
        allProjects =api_service.performQuery(queryProjects,csrf_token)
        allTeams =api_service.performQuery(queryTeams,csrf_token)
        allPartner =api_service.performQuery(queryPartners,csrf_token)
        allOpportunities =api_service.performQuery(queryOpportunities,csrf_token)
        currentUser=api_service.performQuery(currentlyCreatedUser,api_service.getCsrfToken(request))
        trainingSession = api_service.performQuery(queryTrainingSession,csrf_token,api_service.getToken(request))
        
        #convert the data to list and count the data
        countTraining =len(trainingSession['data']['findAllTraining'])
    
        countStaff =len(allAStaff.get('data',{}).get('findAllStaffs',[]))
        countYouth =len(allYouth.get('data',{}).get('findAllYouth', []))
        countProjects =len(allProjects.get('data',{}).get('findAllProjects',[]))
        countTeams =len(allTeams.get('data',{}).get('findAllTeams',[]))
        countPartners=len(allPartner.get('data',{}).get('findAllPartners',[]))
        countOpportunities =len(allOpportunities.get('data',{}).get('findAllOpportunities',[]))
        context={
                'alladmin':countStaff,
                'allyouth':countYouth,
                'allprojects':countProjects,
                'allteams':countTeams,
                'allpartner':countPartners,
                'allopportunities':countOpportunities,
                'currentUser':currentUser['data']['curentlyCreatedUser'],
                'training':countTraining
                }
        print("Admin dashboard data")
        print(context)
        return render(request,'dashboard.html',context)
    
    except Exception as e: 

        print('something went wrong',e)
        messages.error(request,"Somthing Went wrong!")
    return render(request,'dashboard.html',)

#function to create admin
def createStaff(request):
    if request.method =="POST":
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        password = request.POST.get('password')
        role =request.POST.get('role')
        status=request.POST.get('status')
        gender=request.POST.get('gender')

        if status=='Status' or role=='Role':
            messages.error(request,'Invalid Role or Status')
        elif gender=='Gender':
            messages.error(request,'Invalid gender type!')
        else:
            teaamMutation = '''
            mutation CreateAccount($input: CreateAccountInput!) {
                createAccount(createAccountInput: $input) {
                    id
                    role
                    password
                }
            }
            '''
            accountVariables = {
            "input": {
                "email": email,
                "password": password,
                "role": role
            }
            }
            try:
                accountResponse =api_service.performMuttion(teaamMutation,accountVariables)
                if 'errors' in accountResponse:
                    messages.error(request,accountResponse['errors'][0]['message'])
                    print('Error in stafff:',accountResponse['errors'])
                elif 'data' in accountResponse:
                    accountId= accountId = accountResponse['data']['createAccount']['id']
                    #create staff account
                    staffMutation = '''
                     mutation CreateStaff($input:  StaffInputDto !, $accountId: Float!) {
                     createStaff(createStaffInput: $input, accountId: $accountId) {
                      id
                       name
                       phone
                       status
                       gender
                         }
                      }
                    '''
                    staffVariables = {
                    "input": {
                        "name": name,
                        "phone": phone,
                        "status": status,
                        "gender":gender
                    },
                    "accountId": accountId
                    }
                    staffResponse= api_service.performMuttion(staffMutation,staffVariables)
                    if 'errors' in staffResponse:
                        print("Staff muttation encounterde errors")
                        messages.error(request,staffResponse['errors'][0]['message'])

                        #remove user account on failure 
                        removeAccount='''
                        mutation($accountId:Float!){
                         removeAccount(accountId:$accountId){
                           message,statusCode
                           }
                         }  
                        '''
                        response=api_service.performMuttion(removeAccount,{"accountId":accountId})
                        print(response)
                    else:
                        messages.success(request,"Successfully created!")  
                        return redirect('viewStaffs')  
                else:
                    print("Something went wrong")
                    messages.error(request,"Something went wrong")

            except Exception as e:
                print(e)
                messages.error(request,e)
          
    return render(request,'createStaff.html')

#viewTeam sessions
# def viewTeamSession(request):
#     query= '''
#     query {
#     getTeamsTraining {
#     id
#     session
#     description
#     startDate
#     duration
#     endDate
#     noOfparticipants
#      }
#     }
#     '''

#     response = api_service.performQuery(query,api_service.getCsrfToken(request),api_service.getToken(request))
#     return render(request,'team-session.html', {"sessions":response['data']['getTeamsTraining']})
def trainingSessionAplicants(request):
    return render(request,'training-applicants.html')

#function to view all admins available
def viewStaff(request):
    csrf_token = api_service.getCsrfToken(request)
   
   
    query ='''query{
           findAllStaffs{
           id
           email,
           phone,
           name,
           gender,
           status
           
              }
            }'''
    
    #call endpoints
    try:
      response_data =api_service.performQuery(query,csrf_token)
      return render(request,'viewStaff.html',{'staffs':response_data['data']['findAllStaffs']})
    except Exception as e:
        message ='Oooops network issues try again!'
        print(message)
        return  render(request,'viewStaff.html',{message:message})

#function to create partners
def createPartner(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        location = request.POST.get('location')
        address = request.POST.get('pobox')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        password = request.POST.get('password')
        status = request.POST.get('Status')
        
        # Define account mutation
        accountMutation = '''
            mutation CreateAccount($input: CreateAccountInput!) {
                createAccount(createAccountInput: $input) {
                    id
                    email
                    role
                    
                }
            }
        '''
        accountVariables = {
            "input": {
                "email": email,
                "password": password,
                "role": Roles.PARTNER.value
            }
        }
        
        # Define partner mutation
        partnerMutation = '''
            mutation CreatePartner($input: PartnerDto!, $accountId: Float!) {
                 createPartner(createPartnerInput: $input, accountId: $accountId) {
                      id
                       name
                      location
                       phone
                      status
                      address
               }
            }
        '''
        
        # Call API endpoint
        accountResponse = api_service.performMuttion(accountMutation, accountVariables)
        if 'errors' in accountResponse:
            messages.error(request,accountResponse['errors'][0]['message'][0])
            print(accountResponse,"Erro encounterd")

        elif 'data' in accountResponse:
            accountId = accountResponse['data']['createAccount']['id']
            print(accountResponse,"Got this data ")

             # Create partner with account ID
            partnerVariables = {
                    "input": {
                        "name": name,
                        "phone": phone,
                        "address": address,
                        "location": location,
                        "status": status
                    },
                    "accountId": accountId
                }
            
             # Perform mutation to add partner details
            partnerResponse = api_service.performMuttion(partnerMutation, partnerVariables)
            if 'errors' in partnerResponse:
                messages.error(request, partnerResponse['errors'][0]['message']) 

                #perform query to remove the user account pending for new registration
                #If any error occurs while creating pather deatils
                removeAccount='''
                        mutation($accountId:Float!){
                         removeAccount(accountId:$accountId){
                           message,statusCode
                           }
                         }  
                  '''
                response=api_service.performMuttion(removeAccount,{"accountId":accountId})
                print(partnerResponse,response,) 
            else:
                print("Account test passed")
                messages.success(request, 'Successfully created!')
                print(partnerResponse)
                return redirect('viewPartners')
        else:
            print("Something went wrong")
            print(accountResponse)
            messages.error(request, "Something went wrong!")
  
    return render(request, 'createPartner.html')

#function to display all list of partners 
def viewPartners(request):
    
    try:
        # GraphQL query to fetch the partners data 
           query = '''
            query {
                findAllPartners {
                    name
                    id,
                    phone
                    address
                    createdAt
                    location,
                    status
                    
                }
             }
            '''
           response_data = api_service.performQuery(query, api_service.getCsrfToken(request))
           return render(request,'viewPartners.html',{'partners':response_data['data']['findAllPartners']})
        
    except Exception as e:
            print('Error: {}'.format(e)) 
            messages.error(request,'Something went wrong!')
            return render(request,'viewPartners.html')   
              
#function  to create youth         
def createYouth(request):
    if request.method =="POST":
        fname = request.POST.get('fname')
        mname = request.POST.get('mname')
        lname = request.POST.get('lname')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        address = request.POST.get('pobox')
        skills =request.POST.get('skills')
        location = request.POST.get('location')
        education=request.POST.get('education')
        password = request.POST.get('password')
        gender=request.POST.get('gender')
       
        
       # Define account mutation
        youthAccount = '''
            mutation CreateAccount($input: CreateAccountInput!) {
                createAccount(createAccountInput: $input) {
                    id
                    role
                    email
                    
                }
            }
        '''
        accountVariables = {
            "input": {
                "email": email,
                "password": password,
                "role": Roles.YOUTH.value
            }
        }
        
        # Define partner mutation
        youthMutation = '''
            mutation CreateYouth($input: YouthDto!, $accountId: Float!) {
                 createYouth(createYouthInput: $input, accountId: $accountId) {
                      id
                      fname
                      mname
                      lname
                      skills
                      email
                      location
                       phone
                       education
                      address
               }
            }
        '''
        
        # Call API endpoint
        accountResponse = api_service.performMuttion(youthAccount,accountVariables)
        if 'errors' in accountResponse:
            messages.error(request,accountResponse['errors'][0]['message'])
            print(accountResponse,"Got this errors")

        elif 'data' in accountResponse:
            accountId = accountResponse['data']['createAccount']['id']
            print(accountResponse,"Got this data ")

            #Create partner with account ID
            youthDetails = {
                    "input": {
                        "fname":fname,
                        "mname":mname,
                        "lname":lname,
                        "phone": phone,
                        "education":education,
                        "address": address,
                        "location": location,
                        "gender":gender,
                        "skills":skills
                    },
                    "accountId": accountId
                }
            
             # Perform youth creation
            youthResponse = api_service.performMuttion(youthMutation, youthDetails)
            if 'errors' in youthResponse:
                messages.error(request, youthResponse['errors'][0]['message']) 

                #perform query to remove the user account pending for new registration
                removeAccount='''
                        mutation($accountId:Float!){
                         removeAccount(accountId:$accountId){
                           message,statusCode
                           }
                         }  
                  '''
                response=api_service.performMuttion(removeAccount,{"accountId":accountId})
                print(youthResponse,response,) 
            else:
                print("Account test passed")
                messages.success(request, 'Successfully created!')
                print(youthResponse)
                return redirect('viewYouth')
        else:
            print("Something went wrong")
            messages.error(request, "Something went wrong!")
      
    return render(request,'createYouth.html')

#function to fetch all youth 
def viewYouth(request):
    query ='''
    query {
      findAllYouth {
      id
      fname
      mname
      lname
      email
      phone
      location
      address
      skills
     }
    }
       '''
    try:
    
        response_data= api_service.performQuery(query,api_service.getCsrfToken(request))
        if 'error' in response_data:
            print('data error ',response_data['errors'])
        return render(request,'viewYouth.html',{'youths':response_data['data']['findAllYouth']})
    except Exception as e:
        messages.error(request,'Network Problems!')
        
    return  render(request,'viewYouth.html')

#delete youth by id
def deleteYouthById(request):
    if request.method =="POST":
      id =int( request.POST.get('id'))
    
      muatation='''
       mutation($id: Float!) {
       deleteYouthById(id: $id) {
       message
      }
      }

      '''
      try:
          
          response = api_service.performMuttion(muatation,{'id':id} )
          if 'errors' in response:
               messages.error(request,'Failed to delete user!')
               return JsonResponse({'status':status.ERROR.value})
            
          else:
              messages.success(request,response['data'][' deleteYouthById']['message'])
              return JsonResponse({'status':status.SUCCESS.value})
            
      except Exception as e:
           print("Exception:",e)
           return redirect('viewYouth')
  

#Edit youth by Id function 
def editYouthById(request):
    if request.method =="POST":
       youthId = float(request.POST.get('id'))
       fname= request.POST.get('fname')
       mname= request.POST.get('mname')
       lname=request.POST.get('lname')
       phone = request.POST.get('phone')
       location =request.POST.get('location')
       address = request.POST.get('address')
       skills= request.POST.get('skills')

      
      #graphql mUtation 
       mutation ='''
       mutation UpdateYouth($input:UpdateYouthDto!,$youthId:Float!){
          updateYouth(updateYouthDto:$input,youthId:$youthId){
            message,
            statusCode
          }
       }
       '''
       variables ={
           "input":{
               "fname":fname,
               "mname":mname,
               "lname":lname,
               "phone":phone,
               "location":location,
               "address":address,
               "skills":skills
               
           },
           "youthId":youthId
       }
    
       updateYouth = api_service.performMuttion(mutation,variables)

       if 'errors' in updateYouth:
           messages.error(request,updateYouth['errors'][0]['message'])
           print(updateYouth['errors'])
           return JsonResponse({'status':status.ERROR.value})

       if 'data' in updateYouth:
           messages.success(request,updateYouth['data']['updateYouth']['message'])
           print(updateYouth)
           return JsonResponse({'status':status.SUCCESS.value})  
       
 
   

def editPartner(request):
    if request.method =="POST":
       partnerId = float(request.POST.get('id'))
       name=request.POST.get('name')
       phone = request.POST.get('phone')
       location =request.POST.get('location')
       address = request.POST.get('address')
       statuss =request.POST.get('status')
   
      
      #graphql mUtation 
   
       mutation ='''
       mutation UpdatePartner($input:UpdatePartnerDto!,$partnerId:Float!){
          updatePartner(updatePartnerDto:$input,partnerId:$partnerId){
            message,
            statusCode
          }
       }
       '''
       variables ={
           "input":{
              
               "name":name,
               "phone":phone,
               "location":location,
               "address":address,
               "status":statuss
            
           },
           "partnerId":partnerId
       }
       upadatePartner = api_service.performMuttion(mutation,variables)
    

       if 'errors' in upadatePartner:
           messages.error(request,upadatePartner['errors'][0]['message'])
           print(upadatePartner['errors'])
           return JsonResponse({'status': status.ERROR.value}, status= 400)

       if 'data' in upadatePartner:
           messages.success(request,upadatePartner['data']['updatePartner']['message'])
           print(upadatePartner['data'])
           return JsonResponse({'status': status.SUCCESS.value}, status=200)
       
       else:
           messages.error(request,"Internal server error")
           print(upadatePartner)
           return JsonResponse({'status':status.ERROR.value},status=500)
       
    return redirect('viewPartners')

def editTeam(request):
    if request.method =="POST":
       teamId = float(request.POST.get('id'))
       name=request.POST.get('name')
       phone = request.POST.get('phone')
       location =request.POST.get('location')
       address = request.POST.get('address')
       statuss =request.POST.get('status')
   
      
      #graphql mUtation 
   
       mutation ='''
       mutation UpdateTeam($input: UpdateTeamDto!, $teamId: Float!) {
        updateTeam(updateTeamDto: $input, teamId: $teamId) {
          message
          statusCode
          }
        }
       '''
       variables ={
           "input":{
               "name":name,
               "phone":phone,
               "location":location,
               "address":address,
               "status":statuss
            
           },
           "teamId":teamId
       }
       updateTeam = api_service.performMuttion(mutation,variables)
    

       if 'errors' in updateTeam:
           messages.error(request,updateTeam['errors'][0]['message'])
           print(updateTeam['errors'])
           return JsonResponse({'status': status.ERROR.value}, status= 400)

       if 'data' in updateTeam:
           messages.success(request,updateTeam['data']['updateTeam']['message'])
           print(updateTeam['data'])
           return JsonResponse({'status': status.SUCCESS.value}, status= updateTeam['data']['updateTeam']['statusCode'])
       
       else:
           messages.error(request,"Internal server error")
           print(updateTeam)
           return JsonResponse({'status':status.ERROR.value},status=500)
       
    return redirect('viewPartners')


#function  to  view the projects
def viewProjects(request):
   
    #graphql query
    query='''
        query {
     findAllProjects {
    id
    name
    status
    funded
    discription
    cost
    duration
    partnerName
     }
     }
       '''
    try:
        response =api_service.performQuery(query,api_service.getCsrfToken(request))
        context ={'projects':response['data']['findAllProjects']}
    except Exception as e:
        print('failed to fetch data',e)
        return render(request,'viewProjects.html',{'message':'Network issues'})
    return render(request,'viewProjects.html',context)

def createProject(request):

    #query for partners
    queryPartners='''
         query {
         findAllPartners {
          id
          name
         }
         }

        '''
    partnersResponse=api_service.performQuery(queryPartners,api_service.getCsrfToken(request))
    if request.method =="POST":
        name=request.POST.get('name')
        cost=float(request.POST.get('cost'))
        duration=request.POST.get('duration')
        discription=request.POST.get('discription')
        funded=request.POST.get('funded')
        partner=request.POST.get('partner')

        #convert the str (funded) to boleaan
        isFunded= True if funded=='true' else False
       
        mutation = '''
            mutation CreateProject($input: ProjectDto!,$partner: String) {
            createProject(createProjectInput: $input,partner:$partner) {
             id
             name
              }
            }
          '''

        
        variables = {
          "input": {
          "name": name,
           "cost": cost,
           "duration": duration,
          "discription": discription,
           "funded": isFunded
         },
         "partner":partner
        }

        print(variables)
     
        response=api_service.performMuttion(mutation,variables)
        if 'errors' in response:
            print('Failed to create record')
            messages.error(request,'Failed to create record!')
            print(response)
           

        else:
            messages.success(request,'Successffully Created!')
            return redirect('viewProjects')
             
    return render(request,'createProject.html',{'partners':partnersResponse['data']['findAllPartners']})


#delete projject by Id
def deleteProjectById(request):

    if request.method =="POST":
        projectId = request.POST.get('id')
        
        mutation='''
        mutation ($id:Float!){
         removeProject(id: $id) {
         message
         statusCode
        }
       }
 
      '''
        response=api_service.performMuttion(mutation,{"id":int(projectId)})
        if 'errors' in response:
            print(response['errors'])
            messages.error(request,"Failed to delete record")
            return JsonResponse({status:400})
        
        messages.success(request,"Successfully Deleted")
        return JsonResponse({status:400})


    return redirect('viewProjects')

#function to view all availble ooprtunities
def viewOpportunities(request):
    print(api_service.getToken(request),request.session['User']['role'])
    query ='''  
        query {
        findAllOpportunities {
        id
        name
        duration
        location
        }
        }

      '''
 
    response =api_service.performQuery(query,api_service.getCsrfToken(request))
    if 'errors' in response:
        print(response['errors'])
        messages.error(request,"Failed to get data Something went wrong!")
        return render(request,'viewOpportunities.html')
        
    return render(request,'viewOpportunities.html',{'opportunities':response['data']['findAllOpportunities']}) 
 


#fuction to add new opportunities
def createOpportunity(request):
    if request.method =='POST':
        name =request.POST.get('name')
        location =request.POST.get('location')
        duration =request.POST.get('duration')

        
        mutation='''
        mutation($name: String!, $location: String!, $duration: String!) {
        createOpportunity(
        createOpportunityInput: {name: $name,location: $location,duration: $duration}) {
        name
        location
        duration
               }
             }
           '''
        
        variables={
            'name':name,
            'location':location,
            'duration':duration

        }
        try:
           response = api_service.performMuttion(mutation,variables)
           if 'errors' in response:
               messages.error(request,'Failed to create record!')
           else:
               messages.success(request,'Successfully created')
               return redirect('viewOpportunities')
           
        except Exception as e:
          print(e)
          messages.error(request,e)

    return render(request,'createOpportunity.html')

#delete opportunity by id
def deleteOpporrtunityById(request):
    if request.method =='POST':
        id =request.POST.get('id')
        
        muatation='''
           mutation($id: Float!) {
           deleteOpportunityById(id: $id) {
           message
          }
        }
           '''
        try:
            response =api_service.performMuttion(muatation,{'id':id})
            if 'errors' in response:
                messages.error(request,'Failed to delete Opportunity!')
                return JsonResponse({'status': 'error'}, status=400)
          
            else:
                messages.success(request,'Operation successfully!')
                return JsonResponse({'status': 'success'}, status=200)
        except Exception as e:
            messages.error(request,'Network Problems')
            print(e)

    return redirect('viewOpportunities')

def createTeam(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        location = request.POST.get('location')
        address = request.POST.get('pobox')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        password = request.POST.get('password')
        status = request.POST.get('Status')
        
        # Define account mutation
        teaamMutation = '''
            mutation CreateAccount($input: CreateAccountInput!) {
                createAccount(createAccountInput: $input) {
                    id
                    role
                    password
                }
            }
        '''
        teamVariables = {
            "input": {
                "email": email,
                "password": password,
                "role": Roles.TEAM.value
            }
        }
        
        # Define partner mutation
        teamsMutation = '''
            mutation CreateTeam($input: TeamsDto!, $accountId: Float!) {
                 createTeam(createTeamInput: $input, accountId: $accountId) {
                      id
                      name
                      location
                       phone
                      status
                      address
               }
            }
        '''
        
        # Call API endpoint
        accountResponse = api_service.performMuttion(teaamMutation, teamVariables)
        if 'errors' in accountResponse:
            messages.error(request,accountResponse['errors'][0]['message'])
            print(accountResponse,"Got this errors")

        elif 'data' in accountResponse:
            accountId = accountResponse['data']['createAccount']['id']
            print(accountResponse,"Got this data ")

             # Create partner with account ID
            teamDetails = {
                    "input": {
                        "name": name,
                        "phone": phone,
                        "address": address,
                        "location": location,
                        "status": status
                    },
                    "accountId": accountId
                }
            
             # Perform partner creation
            teamResponse = api_service.performMuttion(teamsMutation, teamDetails)
            if 'errors' in teamResponse:
                messages.error(request, teamResponse['errors'][0]['message']) 

                #perform query to remove the user account pending for new registration
                removeAccount='''
                        mutation($accountId:Float!){
                         removeAccount(accountId:$accountId){
                           message,statusCode
                           }
                         }  
                  '''
                response=api_service.performMuttion(removeAccount,{"accountId":accountId})
                print(teamResponse,response,) 
            else:
                print("Account test passed")
                messages.success(request, 'Successfully created!')
                print(teamResponse)
                return redirect('viewTeams')
        else:
            print("Something went wrong")
            print(accountResponse)
            messages.error(request, "Something went wrong!")
    return render(request,'createTeam.html')        
  
    

def viewTeams(request):

    query = '''
            query {
                findAllTeams{
                    name
                    id,
                    phone
                    address
                    createdAt
                    location,
                    status
                    
                }
             }
            '''
    try:
        response_data = api_service.performQuery(query,api_service.getCsrfToken(request))
        return render(request,'viewTeam.html',{'teams':response_data['data']['findAllTeams']})
    except Exception as e:
        print(e)
        messages.error(request,'Network problems!')
    return render(request,'viewTeam.html')
    


def deletePartenerById(request):
    if request.method=="POST":
        id =float(request.POST.get('id'))
        
        muatation='''
        mutation($id: Float!) {
            removePartner(id: $id) {
             message
          }
         }
  
        '''
        response = api_service.performMuttion(muatation,{'id':id} )
        if 'errors' in response:
            messages.error(request,'Failed to delete user!')
            return JsonResponse({'status': 'error'}, status=400)
          
            
        else:
            messages.success(request,response['data']['removePartner']['message'])
            print(response)
            return JsonResponse({'status': 'success'}, status=200)
      
    return redirect('viewPartners')    

 #delete Team  with respect to Id   
def deleteTeamById(request):
    if request.method=="POST":
        id =float(request.POST.get('id'))
        
        muatation='''
        mutation($id: Float!) {
            removeTeam(teamId: $id) {
             message,
             statusCode
          }
         }
  
        '''
        response = api_service.performMuttion(muatation,{'id':id} )
        if 'errors' in response:
            messages.error(request,'Failed to delete User!')
            print(response['errors'])
            return JsonResponse({'status': 'error'}, status=400)
          
            
        else:
            messages.success(request,response['data']['removeTeam']['message'])
            print(response['data'])
            return JsonResponse({'status': 'success'}, status=200)
      
    return redirect('viewTeams')


def viewInstallments(request):
    
    mutation ='''
   mutation CreateInstallment(
     $createInstallmentInput: CreateInstallmentInputByAdmin!$projectId: Float!) {
      createInstallmentByAdmin(
      createInstallmentInput: $createInstallmentInput ,projectId: $projectId) {
    id
     }
     }

    '''
     # all projects
    queryProjects='''
         query {
         findAllProjects {
          id,
          name
           }
          }

       '''
    #query project
    queryPartners='''
         query {
         findAllPartners {
          id,
          name
         }
         }

        '''
    queryInstallmest='''
        query {
      findAllInstallments {
       id
       projectName
       partnerId
       payment_Ref
       paid
       projectCost
       remainAmount
       status
       total_installments
      }
     }

    '''
   
    if request.method == 'POST':
        projectId = request.POST.get('projectId')
        installments=request.POST.get('installments')
        partnerId =request.POST.get('partnerId')
        print(projectId,installments,partnerId)
        
        variables ={
        "createInstallmentInput": {
        "total_installments": int(installments),
        "partnerId":int(partnerId)
       },
       "projectId": int(projectId)
      }
        
        response = api_service.performMuttion(mutation,variables,request.session.get('User')['token'])
      
        if 'errors' in response:
            messages.error(request,response['errors'])
            print(response['errors'])
            return redirect('viewInstallments')
           
        else:
            messages.success(request,'Installment successfully added')
            return redirect('viewInstallments')
            
    allProjects =api_service.performQuery(queryProjects,api_service.getCsrfToken(request))
    allPartner =api_service.performQuery(queryPartners,api_service.getCsrfToken(request))
    installments =api_service.performQuery(queryInstallmest,api_service.getCsrfToken(request),request.session.get('User')['token'])

    context={'projects':allProjects['data']['findAllProjects'],
             'partners':allPartner['data']['findAllPartners'],
             'installments':installments['data']['findAllInstallments']
             }
    return render(request,'viewinstallmenst.html',context)
   
def deleteInstallment(request):
    print(request.session['User'])
    if request.method =="POST":
        installmentId= request.POST.get('id')
      
      #grapqhl mutation
        mutation='''
        mutation($id:Float!) {
        removeInstallment(id: $id) {
         message
         statusCode
         }
         }
        '''

        response = api_service.performMuttion(mutation,{"id":int(installmentId)},api_service.getToken(request))
        if 'errors' in response:
            print(f"Error occured while deleting id:",installmentId)
            print(response['errors'])
            return HttpResponse(messages.error(request,"Failed to delete installment!"))
            
        return HttpResponse(messages.success(request,"Successfully deleted!"))
        


def editProjectDetails(request):
    if request.method=="POST":
        project_id = request.POST.get('editProjectId')
        name = request.POST.get('editProjectName')
        cost = request.POST.get('editProjectCost')
        duration = request.POST.get('editProjectDuration')
        description = request.POST.get('editProjectDescription')
        status = request.POST.get('editProjectStatus')
        funded = request.POST.get('editProjectFunded')

        
        mutation='''
       mutation UpdateProject($projectId: Float!, $input: UpdateProjectDto!) {
       updateProject(
       projectId: $projectId
         updateProjectDto: $input
        ) {
        statusCode
        message
       }
       }

        '''
        variables={
            "input":{
                "name":name,
                "cost":float(cost),
                "duration":duration,
                "discription":description,
                "status":status,
                "funded":bool(funded)
            },
            "projectId":int(project_id)

        }
        response=api_service.performMuttion(mutation,variables)

        if 'errors' in response:
            messages.error(request,response['errors'][0])
            return JsonResponse({status:400})
        
        messages.success(request,"Successfully Updated")
        return JsonResponse({status:200})
       
    else:
        return redirect('viewProjects')



#training-sessions view
def viewSession(request):
        
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

    response = api_service.performQuery(query,api_service.getCsrfToken(request),api_service.getToken(request))
    print(response)
    return render (request,'training-sessions.html',{"sessions":response['data']['findAllTraining']})    

def adminEditSession(request):
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
            response = api_service.performMuttion(mutation,variables,api_service.getToken(request))
            print(response)
            if 'errors' in response:
                print("errors:",response['errors'])
                messages.error(request,response['errors'][0])
                return redirect('viewSessions')
            else:
              messages.success(request,"Successfully Updated!")
            return redirect('viewSessions')
            
        except Exception as e:
            print("something went wrong!",e)
            messages.success(request,"Successfully Updated!")
            return redirect('viewSessions')
        
    return redirect('viewSessions')

def seslectAplicantsForTraining(request):
    #graphql query
    query ='''
     query {
     getAlltrainingAplicants {
    id
    isAproved
    youthName
    trainingId
    trainingName
    youthId
      }
    }

    '''
    response = api_service.performQuery(query,api_service.getCsrfToken(request),api_service.getToken(request))

    context={
        "applicants":response['data']['getAlltrainingAplicants']
    }
   
    return render(request,'training-applicants.html',context)

#confirnm aplicant training aplication
def confirmTrainingApplicant(request,aplicantId):
    mutation ='''
       mutation ($aplicantId:Float!){
       confirmTrainingAplicants(aplicantId: $aplicantId) {
        message
        statusCode
         }
        }
    '''
    if request.method =="POST":
       
        res = api_service.performMuttion(mutation,{"aplicantId":int(aplicantId)},api_service.getToken(request))
        if 'errors' in res:
            print("====ERRROR===",res)
            messages.error(request,"Something Went wrong try Again!")
            return redirect("selectTrainingAplicant")
        
        
        messages.success(request,"Aplicant Confirmed")
        return redirect("selectTrainingAplicant")
    
#confirnm aplicant training aplication
def cancelTrainingConfirmation(request,aplicantId):
    mutation ='''
       mutation ($aplicantId:Float!){
       cancelTrainingConfirmation(aplicantId: $aplicantId) {
        message
        statusCode
         }
        }
    '''
    if request.method =="POST":
       
        res = api_service.performMuttion(mutation,{"aplicantId":int(aplicantId)},api_service.getToken(request))
        if 'errors' in res:
            print("====ERRROR===",res)
            messages.error(request,"Something Went wrong try Again!")
            return redirect("selectTrainingAplicant")
        
        
        messages.success(request,"Confirmation Canceled")
        return redirect("selectTrainingAplicant")
        

#generate project report
def getProjectReportPdf(request, id):
    reportDatamutation = '''
    mutation($id:Float!){
    getProjectReportData(projectId: $id) {
        projectName
        projectDuration
        projectCost
        projectPartner
        ProjectDiscription
        installments {
            id
            total_installments
            status
            payment_Ref
            installment_phase
            paid
            remainAmount
        }
      }
    }
    '''
    # Function to perform GraphQL mutation
    response = api_service.performMuttion(reportDatamutation, {'id': id})
    data = response['data']['getProjectReportData']
    
    projectName = data['projectName']
    projectDuration = data['projectDuration']
    projectCost = data['projectCost']
    projectPartner = data['projectPartner']
    ProjectDiscription = data['ProjectDiscription']
    installments = data['installments']

    def format_number(number):
        return f"{number:,}"

    def add_page_header(c, width, height, is_first_page=False):
        if is_first_page:
            c.setFont("Times-Bold", 16)
            c.drawCentredString(width / 2.0, height - 2 * cm, "DAR ES SALAAM REGIONAL COMMISSION")
            c.setFont("Times-Bold", 16)
            c.drawCentredString(width / 2.0, height - 3 * cm, "PROJECT REPORT")
            logo_path = 'static/dist/img/dsm_logo.png'
            logo = ImageReader(logo_path)
            c.drawImage(logo, 1 * cm, height - 5 * cm, width=3 * cm, height=3 * cm, mask='auto')

    def add_page_footer(c, width, height, page_number):
        c.setFont("Times-Roman", 10)
        c.drawCentredString(width / 2.0, 1 * cm, f"Page {page_number}")

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    page_number = 1

    # Set initial page header
    add_page_header(c, width, height, is_first_page=True)
    y_position = height - 6 * cm

    def check_page_space(c, y_position, required_space, page_number):
        if y_position < required_space:
            add_page_footer(c, width, height, page_number)
            c.showPage()
            page_number += 1
            add_page_header(c, width, height, is_first_page=False)
            y_position = height - 2 * cm
        return y_position, page_number

    # Project details
    c.setFont("Times-Bold", 14)
    c.drawString(1 * cm, y_position, "Details")
    c.line(1 * cm, y_position - 0.3 * cm, width - 1 * cm, y_position - 0.3 * cm)

    y_position -= 1 * cm

    c.setFont("Times-Roman", 12)
    details = [
        f"Project Name: {projectName}",
        f"Project Duration: {projectDuration}",
        f"Project Partner: {projectPartner}",
        f"Project Discription: {ProjectDiscription}",
        f"Project Cost: {format_number(projectCost)}/=Tzs"
    ]

    for detail in details:
        y_position, page_number = check_page_space(c, y_position, 2 * cm, page_number)
        c.drawString(1 * cm, y_position, detail)
        y_position -= 0.5 * cm

    # Project installments
    y_position -= 0.5 * cm

    c.setFont("Times-Bold", 14)
    c.drawString(1 * cm, y_position, "Project Installments")
    c.line(1 * cm, y_position - 0.3 * cm, width - 1 * cm, y_position - 0.3 * cm)

    y_position -= 1 * cm

    c.setFont("Times-Roman", 12)
    if not installments:
        y_position, page_number = check_page_space(c, y_position, 2 * cm, page_number)
        c.drawString(1 * cm, y_position, "No installments made for this project")
        y_position -= 1 * cm
        
    else:
        for installment in installments:
            installment_details = [
                f"Phase No: {installment['installment_phase']}",
                f"Status: {installment['status']}",
                f"Paid: {format_number(installment['paid'])}/=Tzs",
                f"Remaining Amount: {format_number(installment['remainAmount'])}/=Tzs",
                f"Payment Ref: {installment['payment_Ref']}",
                f"Total Installments: {format_number(installment['total_installments'])}"
            ]

            for detail in installment_details:
                y_position, page_number = check_page_space(c, y_position, 2 * cm, page_number)
                c.drawString(1 * cm, y_position, detail)
                y_position -= 0.5 * cm
            y_position -= 1 * cm

    y_position, page_number = check_page_space(c, y_position, 2 * cm, page_number)

    c.setFont("Times-Bold", 14)
    c.drawCentredString(width / 2.0, y_position, "End of Report")

    add_page_footer(c, width, height, page_number)
    c.save()

    # Serve the PDF as a response
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="project_report_{id}.pdf"'
    return response
