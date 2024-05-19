from locust import HttpUser, task, between
import json

class TestCreatePerjalanan(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'
    


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global ManajerPerusahaan
        response = self.client.post("/auth/login",  json = {"username": "manager","password": "123"})
        ManajerPerusahaan = response.json()['data']['token']

        
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def create_shipment(self):
        body =         {
                            "idSupplyChain": "7f6df7c0-d55d-44e8-ac5e-f64e34302a69",
                            "idDivisiPenerima": "7bdcc369-e845-4787-b06a-9a0d90a399d1",
                            "waktuBerangkat": "2024-08-19T13:00",
                            "idTransportasi": "ad415dc0-fe41-46e5-a6c5-d343eaa41ef4",
                            "beratMuatan": "1"
                      }
        
        
        response = self.client.post(f'/company/shipment',  json = body, headers = {'Authorization': f'{ManajerPerusahaan}'} )
        print(response.json())
