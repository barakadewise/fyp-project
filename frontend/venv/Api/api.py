
from django.middleware.csrf import get_token
import requests  # type: ignore

class ApiService:
    
    #Base Api url 
    Baseurl ='http://localhost:3000/graphql'

    #Function to perform mutation
    def performMuttion(self,mutation,variables,token=None):
        headers = {
            'Content-Type': 'application/json',
        }
        if token:
            headers['Authorization'] = f'Bearer {token}'

        response = requests.post(self.Baseurl,json={'query':mutation,'variables':variables},headers=headers)
        if  'errors' in response:
            print("Error occured ..:",response['errors'])
            return response.json()
            
        else:
            print("Request Successffully!")
            return response.json()
        
   

    #function to perform query 
    def performQuery(self,query,csrf_token,token=None):
        headers ={
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token,
        }
        if token:
            headers['Authorization']=f'Bearer {token}'
        response =requests.get(self.Baseurl,params={'query': query },headers=headers)
        if 'errors' in response:
            print("Query request error..:.",response['errors'])
            return response.json()
        
        else:
            print("Sucessfully Query!")
            return response.json()
            
            
       
     #function to return csrf token from the request       
    def getCsrfToken(self,request):
        return get_token(request)
    
 