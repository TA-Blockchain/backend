from locust import HttpUser, task, between
import json
class TestCreateSupplyChain(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global manajer_perusahaan
        global admin_perusahaan
      
        # response = self.client.post("/auth/login",  json= {"username": "manager","password": "123"})
        # print("res",response.json())
        # manajer_perusahaan = response.json()['data']['token']
        response = self.client.post("/auth/login",  json = {"username": "company","password": "123"})
        admin_perusahaan = response.json()['data']['token']

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass


    # @task(1)
    # def verifikasi_perjalanan(self):
    #     body = {
    #                 "identifier": {
    #                     "shipment" : "d94d849acd3e2bdae47662d309af73d124e6e16763661ac3bd08217f6bb4b667"
    #                 }
    #             }
    #     headers = {'Authorization': f'{manajer_perusahaan}'}
    #     response = self.client.post(f'/company/shipment/verify/',json=body , headers = headers )
       

      
    @task(1)
    def verifikasi_carbon_transaction(self):
        body = {
                "identifier": {
                    "carbonTransaction" : "a900cc30ec9e949d8feddb67a5e22f4de63d3ecfc76abeaccf0000eeb4023c6a"
                }
              }
       
        
        headers = {'Authorization': f'{admin_perusahaan}'}
        response = self.client.post(f'/carbon_trading/transactions/verify',json=body, headers = headers )
        