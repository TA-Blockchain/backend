from locust import HttpUser, task, between

class TestCreateSupplyChain(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global manajer_perusahaan
        global admin_perusahaan
      
        response = self.client.post("/auth/login",  json= {"username": "manager","password": "123"})
        print("res",response.json())
        manajer_perusahaan = response.json()['data']['token']
        response = self.client.post("/auth/login",  json = {"username": "company","password": "123"})
        admin_perusahaan = response.json()['data']['token']

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass


    @task(1)
    def identifier_perjalanan(self):
        
        headers = {'Authorization': f'{manajer_perusahaan}'}
        idPerjalanan='9d98d43f-ef23-4e87-8556-fc60af0778ab'
        response = self.client.post(f'/company/shipment/identifier/{idPerjalanan}', headers = headers )
        print(response.json())

      
    @task(1)
    def identifier_carbon_transaction(self):
        headers = {'Authorization': f'{admin_perusahaan}'}
        idCt='859dbf54-39b3-43cc-8c6a-8b8937b12c9f'
        response = self.client.post(f'/carbon_trading/transactions/identifier/{idCt}', headers = headers )
        print(response.json())