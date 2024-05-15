from locust import HttpUser, task, between

class TestCreateSupplyChain(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.212.240:8000/api/v1'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global manajer_perusahaan
        global admin_perusahaan
      
        response = self.client.post("/auth/login",  json= {"username": "mmm","password": "123"})
        print("res",response.json())
        manajer_perusahaan = response.json()['data']['token']
        response = self.client.post("/auth/login",  json = {"username": "google","password": "123"})
        admin_perusahaan = response.json()['data']['token']

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass


    @task(1)
    def identifier_perjalanan(self):
        
        headers = {'Authorization': f'{manajer_perusahaan}'}
        idPerjalanan='c384aded-9d3a-4daa-888f-99703f98b9c9'
        response = self.client.post(f'/company/shipment/identifier/{idPerjalanan}', headers = headers )
        print(response.json())

      
    @task(1)
    def identifier_carbon_transaction(self):
        headers = {'Authorization': f'{admin_perusahaan}'}
        idCt='a6819f9a-9075-45b2-858d-a13ac9e3b89f'
        response = self.client.post(f'/carbon_trading/transactions/identifier/{idCt}', headers = headers )
        print(response.json())