
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

        # Define the GraphQL mutation query with variables
        mutation = '''
        mutation LoginMutation($username: String!, $password: String!) {
          login(loginInput: {
            email: $username,
            password: $password
          }) {
            message
            access_token
            role
          }
        }
        '''

        variables = {
            'username': email,
            'password': password,
            
        }

        # Make a POST request to your GraphQL endpoint
        response = api.performMuttion(mutation,variables)

        if 'errors' in response:
            messages.error(request,response['errors'][0]['message'])
            print('Errors:',response)
            return render(request,'login.html')

        elif 'data' in response:
           print('Successfully loged in:',response)
           data =response['data']['login']
         
           if data and 'access_token' in data:
               print(data['access_token'])
               if data['role']==roles.ADMIN.value:
                   print('Your the ADMIN')
                   request.session['token'] = data['access_token']
                   messages.success(request,data['message'])
                   return redirect('adminPanel')
               
               elif data['role']==roles.PARTNER.value:
                   print('Your the PARTNER')
                   request.session['token'] = data['access_token']
                   messages.success(request,data['message'])
                   return redirect('partnerDashboard')

               elif data['role']==roles.STAFF.value:
                   print("Your the STAFF")
                   request.session['token'] = data['access_token']
                   messages.success(request,data['message'])

               elif  data['role']==roles.TEAM.value:
                   print("Your the TEAM")
                   request.session['token'] = data['access_token']
                   messages.success(request,data['message'])

               elif data['role']==roles.YOUTH.value:
                   print("Your the YOUTH")
                   request.session['token'] = data['access_token']
                   messages.success(request,data['message'])
               else:
                   print('Invalid User Role Please Check!')
                   messages.error(request,'Invalid User Role Please Check!') 
            
           else:
               messages.error(request,"Invalid User cridentials")     

        else:
            print("Something went wrong")
            messages.error(request,'Something went wrong!')
            print(response)
            return render(request,'login.html')

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
                    elif 'data' in response:
                        print("Opertion was successfully")
                        accountId=response['data']['createAccount']['id']
                        messages.success(request,"Successfuly registered")
                        return redirect('complete-profile',account_id=accountId)
                    else:
                        print("Unexpected erros occurred")
                        messages.error(request,"Unexpected erros occurred")   
                        
                else:
                    print("Password musb be atleast 5")   
                    messages.error(request,"Password musb be atleast 5") 
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

def logout(request):
    request.session.clear()
    messages.success(request,'Successfully logged out!')
    return redirect('/')