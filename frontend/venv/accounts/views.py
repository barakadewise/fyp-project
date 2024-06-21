
from django.shortcuts import render,redirect
import re
from django.contrib import messages
from Api.api import ApiService
from shared.roles_enum import Roles




# api instancee
api =ApiService()
roles=Roles

#loging function 
def loginPage(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        mutation = '''
        mutation LoginMutation($username: String!, $password: String!) {
          login(loginInput: {
            email: $username,
            password: $password
          }) {
            message
            access_token
            role
            id
          }
        }
        '''

        variables = {
            'username': email,
            'password': password,
        }

        response = api.performMuttion(mutation, variables)

        if 'errors' in response:
            messages.error(request, response['errors'][0]['message'])
            return render(request, 'login.html')

        elif 'data' in response:
            data = response['data']['login']
            if data and 'access_token' in data:
                token = data['access_token']
                role = data['role']
                userId = data['id']

                
                userKey = {
                    'token': token,
                    'role': role,
                    'userId': userId
                }
                request.session['User'] = userKey

                if role == roles.ADMIN.value:
                    messages.success(request,"Successfully loggedin")
                    return redirect('adminPanel')
                elif role == roles.PARTNER.value:
                    messages.success(request,"Successfully loggedin")
                    return redirect('partnerDashboard')
                    
                elif role == roles.STAFF.value:
                    messages.success(request,"Successfully loggedin")
                    print("Loooged in as Team")
                    return redirect('staffDashboard')
                elif role == roles.TEAM.value:
                    messages.success(request,"Successfully loggedin")
                    return redirect('teamDashboard')
                elif role == roles.YOUTH.value:
                    messages.success(request,"Successfully loggedin")
                    return redirect('youthDashboard')
                else:
                    messages.error(request, 'Invalid Credentials Please Check!')
                    return render(request, 'login.html')
                
            else:
                messages.error(request, "Invalid User credentials")     

        else:
            messages.error(request, 'Something went wrong!')
            return render(request, 'login.html')

    return render(request, 'login.html')
#signup function for Youth
def signupPage(request):
    if request.method=="POST":
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")
        

         # Construct the GraphQL mutation
        mutation = """
            mutation CreateAccount($input: CreateAccountInput!) {
                createAccount(createAccountInput: $input) {
                    id
                    email
                    role
                    
                }
            }
        """

        # Variables for the GraphQL mutation
        variables = {
            "input": {
                "email": email,
                "password": password1,
                'role':roles.YOUTH.value
                
            }
        }

        if  is_valid_email(email):
            if password1==password2:
                if len(password1)>=5:
                    #create account
                    response=api.performMuttion(mutation,variables)
                    if 'errors' in response:
                        print(response['errors'])
                        messages.error(request,response['errors'][0]['message'])
                    else:
                        print("Opertion was successfully")
                        accountId=response['data']['createAccount']['id']
                        messages.success(request,"Successfuly registered")
                        return redirect('complete-profile',account_id=accountId)
                    
                else:
                    print("Password musb be atleast 5")   
                    messages.error(request,"Password must be atleast 5 characters long!") 
            else:
                print("Password dont match ")
                messages.error(request,"Password dont match ") 
        else:
            print("Email is invalid check again") 
            messages.error(request,"Email is invalid check again")    
    return render(request,'signup.html')

#complete profile function
def completeProfile(request,account_id):
    if request.method == "POST":
        fname = request.POST.get("fname")
        mname = request.POST.get("mname")
        lname = request.POST.get("lname")
        gender = request.POST.get("gender")
        phone = request.POST.get("phone")
        address = request.POST.get("pobox")
        skills = request.POST.get("skills")
        location=request.POST.get("location")
        education =request.POST.get("education")
        

        mutation = """
             mutation CreateYouth($input: YouthDto!, $accountId: Float!) {
                 createYouth(createYouthInput: $input, accountId: $accountId) {
                      id
                      fname
                      mname
                      lname
                      gender
                      skills
                      email
                      location
                       phone
                       education
                      address
               }
            }
        """

        variables = {
           "input": {
                    "fname":fname,
                    "mname":mname,
                    "lname":lname,
                    "phone": phone,
                    "gender":gender,
                    "education":education,
                    "address": address,
                    "location": location,
                    "skills":skills
                    },
                    "accountId": account_id
        }

        response = api.performMuttion(mutation,variables)
        if 'errors' in response:
            print("Errors encounterd",response['errors'])
            messages.error(request,response['errors'][0]['message'])
            
            #remove user account when error encountered
            removeAccount='''
                        mutation($accountId:Float!){
                         removeAccount(accountId:$accountId){
                           message,statusCode
                           }
                         }  
                  '''
            remove=api.performMuttion(removeAccount,{"accountId":account_id})
            print(remove)
        
        elif 'data' in response:
            print(response,'successfully')
            messages.success(request,"Successfuly updated")
            #redirect the user to the login page 
            return redirect('login')
        else:
            print("Netwwork issues")
            messages.error(request,"Netwwork issues")

    return render(request,'complete_profile.html')

#email validator function
def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email)

#logout function
def logout(request):
    del request.session['User'] 
    messages.success(request, 'Successfully logged out!')
    return redirect('/')
