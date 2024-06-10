from django.shortcuts import render,redirect
from django.contrib import messages
from Api.api import ApiService

#Api instance
api_service = ApiService()

def partnerDashbord(request):
    print("Partner here is your token:",request.session.get('User')['token'])

    return render(request,'partner-dashboard.html')

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
        print("from response")
        print(installmentsRes['errors'],'From installments')
        messages.error(request,installmentsRes['errors'])
        return render(request, 'partner-projects.html')
        
    
    
    print(installmentsRes['data'])
    return render(request, 'partner-projects.html', {'projects': response['data']['findAllProjects'],'installments':installmentsRes['data']['partnerInstallments']})


def viewOpportunities(request):
    return render(request,'partner-opportunities.html')