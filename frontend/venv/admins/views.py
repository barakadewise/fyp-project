
from django.shortcuts import render,redirect
from django.http import HttpResponse
import json
from Api.api import ApiService
from django.contrib import messages


#an aoi instance service class
api_service = ApiService()

#function to load admin dashpanel
def getAdminPanel(request):
    return render(request,'dashboard.html')


#function to create admin
def createAdmin(request):
    return render(request,'createAdmin.html')

#function to view all admins available
def viewAdmin(request):
    csrf_token = api_service.getCsrfToken(request)
    context ={}
    #Graphql query 
    query ='''query{
           findAlladmins{
           id
           email,
           phone,
           name,
           is_superAdmin
              }
            }'''
    
    try:
      response_data =api_service.performQuery(query,csrf_token)
      context={'admins':response_data['data']['findAlladmins']}
      print(context)
      return render(request,'viewAdmins.html',context=context)
    except Exception as e:
        message ='Oooops network issues try again!'
        print(message)
        return  render(request,'viewAdmins.html',{message:message})

#function to create partners
def createPartner(request):
    
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name')
        location = request.POST.get('location')
        address = request.POST.get('pobox')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        # Construct the GraphQL variables
        variables = {
            "name": name,
            "location": location,
            "address": address,
            "phone": phone,
            "email": email,
            "password": password
        }

        mutation = '''
            mutation($name: String!, $location: String!, $address: String!, $phone: String!, $email: String!, $password: String!) {
                createPartner(createPartnerInput: {name: $name, location: $location, address: $address, phone: $phone, email: $email, password: $password}) {
                    name
                    email
                    id
                    createdAt
                    address
                }
            }
        '''
        
        try:

           response_data =api_service.performMuttion(mutation,variables)
           return  render(request, 'createPartner.html')  

        except Exception as e:
            message ='Network issues try again!'
            print(message)
            return render(request, 'createPartner.html',{message:message})
           
        
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
                    id
                    address
                    createdAt
                    email
                    location
                    
                }
             }
            '''
           response_data = api_service.performQuery(query,csrf_token)
           
           #Pass the data to the dictionary 
           context={'partners':response_data['data']['findAllPartners']}
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
    userId = request.POST.get('userId')
    print(userId)
    print('user successfully deleted!')
    return HttpResponse('ok')


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
           reponse = api_service.performMuttion(mutation,variables)
           if reponse:
               messages.success(request,'Successfully created')
               return redirect('createOpportunity')
               
           else:
               messages.error(request,'Failed to create record!')
        except Exception as e:
          print(e)

    
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
                print(response['data']['deleteOpportunityById']['message'])
            else:
                print(response)
        except Exception as e:
            print('Filed to perform operation')

    return render(request,'viewOpportunities.html')