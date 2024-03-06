
from django.shortcuts import render
from django.http import HttpResponse
import requests



#function to load admin dashpanel
def getAdminPanel(request):
    return render(request,'dashboard.html')


#function to create admin
def createAdmin(request):
    return render(request,'createAdmin.html')

#function to create partners
def createPartner(request):
    # GraphQL endpoint URL
    apiUrl = 'https://c4f9-197-250-198-16.ngrok-free.app/graphql'
    
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
        response = requests.post(apiUrl, json={'query': mutation, 'variables': variables})
        
        # Check if the request was successful
        if response.status_code == 200:
            print("successfully added",variables)
            return HttpResponse("Partner created successfully!")
        else:
            print("failed" ,response.text)
            return HttpResponse("Failed to create partner. Error: {}".format(response.text))
    
    # If request method is not POST, render the form
    return render(request, 'createPartner.html')

#function to display all list of partners 
def viewPartners(request):
    return render(request,'viewPartners.html')