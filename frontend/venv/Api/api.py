import requests

class ApiService:
    
    #Base Api url 
    Baseurl ='http://localhost:3000/graphql'

    #Function to perform mutation
    def performMuttion(self,mutation,variables):
        response = requests.post(self.Baseurl,json={'query':mutation,'variables':variables})
        if response.status_code==200:
            return response.json()
        else:
            print(response.text)
            raise Exception('failed to perform mutation ')
    

    #function to perform query 
    def performQuery(self,query,csrf_token):
        headers ={
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token,
        }
        response =requests.get(self.Baseurl,params={'query': query },headers=headers)
        if response.status_code==200:
            return response.json()
        else:
            print("Request failed with status code:", response.status_code)
            print("Response content:", response.content)
            raise Exception('failed to pull data')
            
         