from locust import HttpUser, task, between
import json

class TestSupplyChain(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'
    


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global AdminPerusahaan

        response = self.client.post("/auth/login",  json = {"username": "google","password": "123"})
        AdminPerusahaan = response.json()['data']['token']
        

        
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def create_supply_chain(self):  
        body = {}
        
        body['listPerusahaan'] = ["5a8e4171-29ed-4d2d-8967-cf425e89348b", "b382da1b-70a2-42cf-9f86-220fb3ed40a6"]
        body['nama'] = "supplychainTryia"
        body['deskripsi'] = "iniSupoplychain"
       
        response = self.client.post(f'/company/supply_chain',  json = body, headers = {'Authorization': f'{AdminPerusahaan}'} )
        # print(response.json())

    @task(2)
    def list_supply_chain(self):
        
        response = self.client.get(f'/company/supply_chain',  headers = {'Authorization': f'{AdminPerusahaan}'} )
        # print(response.json())
