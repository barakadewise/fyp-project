import requests
from django.middleware.csrf import get_token

class ApiService:
    
    #Base Api url 
    Baseurl ='http://localhost:3000/graphql'

    #Function to perform mutation
    def performMuttion(self,mutation,variables):
        response = requests.post(self.Baseurl,json={'query':mutation,'variables':variables})
        if response.status_code==200:
            return response.json()
        else:
            raise Exception('failed to perform mutation ')
    

    #function to perform query 
    def performQuery(self,query,csrf_token):
        headers ={
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token,
        }
        response =requests.get(self.Baseurl,params={'query': query },headers=headers)
        if response.ok:
            return response.json()
        
        else:
            print('Failed')
            raise Exception('failed to pull data')
            
     #function to return csrf token from the request       
    def getCsrfToken(self,request):
        return get_token(request)