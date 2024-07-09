from django.shortcuts import render,redirect
from django.contrib import messages
from Api.api import ApiService

#Api instance
api_service = ApiService()

def partnerDashbord(request):
    print("Partner here is your token:",request.session.get('User')['token'])
    queryOpportunities='''
        query {
          findAllOpportunities {
         id
        }
       }

     '''
    queryProjects='''
         query {
         findAllProjects {
          id
           }
          }

       '''
    allOpportunities =api_service.performQuery(queryOpportunities,api_service.getCsrfToken(request))
    allProjects =api_service.performQuery(queryProjects,api_service.getCsrfToken(request))

    if 'errors' in allProjects:
    
        print(allProjects['errors'])
        messages.error(request,"Failed to Load data Something Went Wrong!")
        return render(request,'partner-dashboard.html')

    if 'errors' in allOpportunities:
        print(allOpportunities['errors'])
        messages.error(request,"Failed to Load data Something Went Wrong!")
        return render(request,'partner-dashboard.html')

    context={
        "opportunitiesCount":len(allOpportunities['data']['findAllOpportunities']),
        "projects":len(allProjects['data']['findAllProjects'])

    }
    print(context)
    
    return render(request,'partner-dashboard.html',context)

def viewProjects(request):
    query = '''
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
    
    installments_query = '''
        query {
             partnerInstallments {
                id
                projectName
                partnerId
                payment_Ref
                paid
                projectCost,
                status,
                remainAmount,
                total_installments
            }
        }
    '''
   
   
    installmentsRes = api_service.performQuery(installments_query, api_service.getCsrfToken(request), request.session.get('User')['token'])
    response = api_service.performQuery(query, api_service.getCsrfToken(request))

    if 'errors' in response or 'errors' in installmentsRes:
        print({'responseDta':
            response,
            'installmentResDta':
            installmentsRes
            })
        print(installmentsRes['errors'],'From installments')
        messages.error(request,installmentsRes['errors'])
        return render(request, 'partner-projects.html')
        
    
    context={
        'projects': response['data']['findAllProjects'],
        'installments':installmentsRes['data']['partnerInstallments']
        }
   
    return render(request, 'partner-projects.html',context)


def viewOpportunities(request):
    query='''  
        query {
        findAllOpportunities {
        id
        name
        duration
        location
        }
        }

      '''
    response= api_service.performQuery(query,api_service.getCsrfToken(request))
    if 'errors' in response:
        print(response['errors'])
        messages.error(request,'Failed to get data Something went wrong!')
        
    return render(request,'partner-opportunities.html',{'opportunities':response['data']['findAllOpportunities']})

def fundProject(request):
    mutation ='''
    mutation CreateInstallment($createInstallmentInput: CreateInstallmentInput!, $projectId: Float!) {
    createInstallment(createInstallmentInput: $createInstallmentInput, projectId: $projectId) {
    id
    total_installments
    projectCost
    payment_Ref
    paid
    status
    remainAmount
    createdAt
    }
   }
    '''
    if request.method=='POST':
      
        installments=request.POST.get('installments')
        projectId=request.POST.get('projectId')
        
        varibales ={
            "projectId":int(projectId),
            "createInstallmentInput":{
                "total_installments":int(installments)
            }
        }
        print(varibales)
        response =api_service.performMuttion(mutation,varibales,api_service.getToken(request))
        if 'errors' in response:
            print(response['errors'])
            messages.error(request,'Something went wrong')
            pass

        else:
           messages.info(request,'Request initiated!')
           pass
        return redirect('partnerViewProject')