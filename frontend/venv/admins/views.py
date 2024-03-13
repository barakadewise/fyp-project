
from django.shortcuts import render
from django.http import HttpResponse
import json
from django.middleware.csrf import get_token

from Api.api import ApiService


#an aoi instance service class
api_service = ApiService()

#function to load admin dashpanel
def getAdminPanel(request):
    return render(request,'dashboard.html')


#function to create admin
def createAdmin(request):
    return render(request,'createAdmin.html')

#function to create partners
def createPartner(request):
    
    # Check if the form is submitted
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
        print(variables)
        # GraphQL mutation
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
        
        # Send GraphQL mutation to the endpoint
        response_data =api_service.performMuttion(mutation,variables)
        print(response_data['data']['createPartner'])
        if 'error' not in response_data:
            print('successfully!')
            return HttpResponse('Successfully response:{}'.format(response_data))
        else:
            print("Got errors. error:{}".format(response_data))
            return HttpResponse("Got errors. error:{}".format(response_data))  

    
    # If request method is not POST, render the form
    return render(request, 'createPartner.html')

#function to display all list of partners 

def viewPartners(request):
        
        #get the crsf token from the request 
        csrf_token = get_token(request)
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
            return HttpResponse('Error: {}'.format(str(e)))
        
           
        
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
        
        variable={
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
        resposnse_data= api_service.performMuttion(mutation,variables=variable)
        print(resposnse_data)
    return render(request,'createYouth.html')