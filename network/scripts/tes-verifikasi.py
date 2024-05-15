from locust import HttpUser, task, between
import json
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
    def verifikasi_perjalanan(self):
        body = {
                    "identifier": {
                        "shipment" : "b322f7322595051d6dac61ed55ede1e2e2fab03baa03ca2f479e147449692203"
                    }
                }
        headers = {'Authorization': f'{manajer_perusahaan}'}
        response = self.client.post(f'/company/shipment/verify/',json=body , headers = headers )
       

      
    @task(1)
    def verifikasi_carbon_transaction(self):
        body = {
                "identifier": {
                    "carbonTransaction" : "a14edc8f82a8d68ca7e85b71a507fdb2f66cadb59fbd91d185ecde9ca68297e9"
                }
              }
       
        
        headers = {'Authorization': f'{admin_perusahaan}'}
        response = self.client.post(f'/carbon_trading/transactions/verify',json=body, headers = headers )
        