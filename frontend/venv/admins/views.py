
from django.shortcuts import render,redirect
from Api.api import ApiService
from django.contrib import messages
from shared.roles_enum import Roles

#Api instance
api_service = ApiService()
roles= Roles

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
    try:
        allAStaff =api_service.performQuery(queryStaff,csrf_token)
        allYouth =api_service.performQuery(queryYouth,csrf_token)
        allProjects =api_service.performQuery(queryProjects,csrf_token)
        allTeams =api_service.performQuery(queryTeams,csrf_token)
        allPartner =api_service.performQuery(queryPartners,csrf_token)
        allOpportunities =api_service.performQuery(queryOpportunities,csrf_token)
        
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
                'allopportunities':countOpportunities
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
            #call api end point 
            accountMutation = '''
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
                accountResponse =api_service.performMuttion(accountMutation,accountVariables)
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
                    role
                    password
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
        #get the crsf token from the request 
        csrf_token = api_service.getCsrfToken(request)
        context ={}

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
           response_data = api_service.performQuery(query,csrf_token)
           
           #Pass the data to the dictionary 
           context={'partners':response_data['data']['findAllPartners']}
           print(context)
           return render(request,'viewPartners.html',context=context)
        
        except Exception as e:
            print('Error: {}'.format(e)) 
            return render(request,'viewPartners.html',{'error':'Failed to fetch '})
              
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
        password2 = request.POST.get('password2')
        
        variables={
            "fname":fname,
            "mname":mname,
            "lname":lname,
            "phone":phone,
            "address":address,
            "education":education,
            "skills":skills,
            "location":location,
            "email":email,
            "password":password
        }

        #Graphql Mutation
        mutation='''
            mutation($fname: String!,$mname: String!,$lname: String!,$phone: String!,$address: String!,$education: String!,$skills: String!,$location: String!,$email: String!,$password: String!){
                createYouth(createYoutDto: {fname: $fname,mname: $mname,lname: $lname,phone: $phone,address: $address,education: $education,skills: $skills,location: $location,email: $email,password: $password,}){
                    fname
                    mname
                    lname
                    email
                    skills
                }
            }
        '''
        resposnse_data= api_service.performMuttion(mutation,variables)
        print(resposnse_data)
    return render(request,'createYouth.html')

#function to fetch all youth 
def viewYouth(request):
    #tokens
    csrfToken = api_service.getCsrfToken(request)
    context ={}

   #graphql query 
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
      email
      skills
     }
    }
       '''
    try:
    
        response_data= api_service.performQuery(query,csrfToken)
        context ={'youths':response_data['data']['findAllYouth']}
        if 'error' in response_data:
            print('data error ')
        return render(request,'viewYouth.html',context=context)
    except Exception as e:
        print('Failed to query ')
        return  render(request,'viewYouth.html')

#delete youth by id
def deleteYouthById(request):
    id =int( request.POST.get('id'))
    print(id)
    muatation='''
       mutation($id: Float!) {
       deleteYouthById(id: $id) {
       message
      }
      }

    '''
    try:
        response =api_service.performMuttion(muatation,{'id':id})
        if not response:
            print(response)
            
        else:
            print(response)
            
    except Exception as e:
        print(e)
    
    return render(request,'viewYouth.html')

#function  to  view the projects
def viewProjects(request):
    csrf_token =api_service.getCsrfToken(request)
    context ={}
    
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
     }
     }
       '''
    try:
        response =api_service.performQuery(query,csrf_token)
        context ={'projects':response['data']['findAllProjects']}
    except Exception as e:
        print('failed to fetch data',e)
        return render(request,'viewProjects.html',{'message':'Network issues'})
    return render(request,'viewProjects.html',context)

def createProject(request):
    if request.method =="POST":
        name=request.POST.get('name')
        cost=float(request.POST.get('cost'))
        duration=request.POST.get('duration')
        discription=request.POST.get('discription')
        status=request.POST.get('status')
        funded=bool(request.POST.get('funded'))

       #variables
        variables={
            "name":name,
            "cost":cost,
            "duration":duration,
            "discription":discription,
            "status":status,
            "funded":funded

        }
        #graphql mutation
        mutation='''
        mutation(
        $name: String!
        $cost: Float!
        $duration: String!
        $discription: String!
        $status: String!
        $funded: Boolean!
       ) {
       createProject(
       createProjectInput: {name: $name,cost: $cost,duration: $duration,discription: $discription,status: $status,funded: $funded}
       )  {
      id
      name
       }
       }
         '''
        response=api_service.performMuttion(mutation,variables)
        if response:
            print('Record created successfuly')
            return render(request,'createProject.html')

        else:
            print('failed to create record') 
    return render(request,'createProject.html')

#function to view all availble ooprtunities
def viewOpportunities(request):
   
    csrf_token =api_service.getCsrfToken(request)

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
        response =api_service.performQuery(query,csrf_token)
        return render(request,'viewOpportunities.html',{'opportunities':response['data']['findAllOpportunities']})
    except Exception as e:
        print(e)
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
        id =int(request.POST.get('id'))
        
        muatation='''
       mutation($id: Float!) {
       deleteOpportunityById(id: $id) {
       message
       }
      }
           '''
        try:
            response =api_service.performMuttion(muatation,{'id':id})
            if response:
                #todo success message
                print(response['data']['deleteOpportunityById']['message'])
            else:
                #todo error message!
                print(response)
        except Exception as e:
            print('Filed to perform operation')

    return render(request,'viewOpportunities.html')

def viewTeams(request):
    return render(request,'viewTeam.html')