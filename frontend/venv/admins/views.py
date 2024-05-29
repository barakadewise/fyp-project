
from django.shortcuts import render,redirect
from Api.api import ApiService
from django.contrib import messages
from shared.roles_enum import Roles, Status
from django.http import JsonResponse

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
    queryAllAccounts='''
       query{
       findAllAccount{
       id,
       email,
       lastlogin,
       role,
       createdAt
       }
       }
     '''
    try:
        allAStaff =api_service.performQuery(queryStaff,csrf_token)
        allYouth =api_service.performQuery(queryYouth,csrf_token)
        allProjects =api_service.performQuery(queryProjects,csrf_token)
        allTeams =api_service.performQuery(queryTeams,csrf_token)
        allPartner =api_service.performQuery(queryPartners,csrf_token)
        allOpportunities =api_service.performQuery(queryOpportunities,csrf_token)
        accounts=api_service.performQuery(queryAllAccounts,api_service.getCsrfToken(request))
        
        #convert the data to list and count the data
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
                'accounts':accounts['data']['findAllAccount']
                }
        print(countStaff,countYouth,countPartners)
        return render(request,'dashboard.html',context)
    
    except Exception as e: 
        print('something went wrong',e)
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
            print(accountResponse,"Got this errors")

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
            
             # Perform partner creation
            partnerResponse = api_service.performMuttion(partnerMutation, partnerVariables)
            if 'errors' in partnerResponse:
                messages.error(request, partnerResponse['errors'][0]['message']) 

                #perform query to remove the user account pending for new registration
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
            print(accountResponse)
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
        print('Failed to query')
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
               return JsonResponse({'status': 'error'}, status=400)
          
            
          else:
              messages.success(request,response['data'][' deleteYouthById']['message'])
              print(response,"Data received.... ")
              return JsonResponse({'status': 'success'}, status=200)
            
      except Exception as e:
           print(e)
    
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
           return JsonResponse({'status': status.ERROR.value}, status= 400)

       if 'data' in updateYouth:
           messages.success(request,updateYouth['data']['updateYouth']['message'])
           print(updateYouth)
           return JsonResponse({'status': status.SUCCESS.value}, updateYouth['updateYouth']['statusCode'])
       
       else:
           messages.error(request,"Internal server error")
           print(updateYouth)
           return JsonResponse({'status':status.ERROR.value},status=500)
       
    return redirect('viewYouth')
   

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
           return JsonResponse({'status': status.SUCCESS.value}, status= upadatePartner['data']['updatePartner']['statusCode'])
       
       else:
           messages.error(request,"Internal server error")
           print(upadatePartner)
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
        status=request.POST.get('status')
        funded=bool(request.POST.get('inlineRadioOptions'))
        partner=request.POST.get('partner')
       
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
          "status": status,
           "funded": funded
         },
         "partner":partner
        }
     
        response=api_service.performMuttion(mutation,variables)
        if 'errors' in response:
            print('Failed to create record')
            messages.error(request,'Failed to create record!')
            print(response)
            # return redirect('createProje')

        else:
            messages.success(request,'Successffully Created!')
            return redirect('viewProjects')
             
    return render(request,'createProject.html',{'partners':partnersResponse['data']['findAllPartners']})

#function to view all availble ooprtunities
def viewOpportunities(request):
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
    try:
        response =api_service.performQuery(query,api_service.getCsrfToken(request))
        return render(request,'viewOpportunities.html',{'opportunities':response['data']['findAllOpportunities']}) 
    except Exception as e:
        print(e)
        messages.error(request,'Network Problems')
    return render(request,'viewOpportunities.html')


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
    

#TODO IMPLEMENT THIS WIT TOKEN FOR SECURITY 
def deletePartenerById(request):
       
    if request.method=="POST":
        id =int(request.POST.get('id'))
        
    
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
      
           
        
    return redirect('viewPartners',{'response':response})    
    