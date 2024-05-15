from locust import HttpUser, task, between
import json

class TestCreatePerjalanan(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.212.240:8000/api/v1'
    


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global ManajerPerusahaan
        response = self.client.post("/auth/login",  json = {"username": "mmm","password": "123"})
        ManajerPerusahaan = response.json()['data']['token']

        
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def create_shipment(self):
        body =         {
                            "idSupplyChain": "1ef35b43-4855-4b6e-955b-9a22144999f5",
                            "idDivisiPenerima": "5e2674a3-af25-4e9b-afba-d74bc798d6d0",
                            "waktuBerangkat": "2024-08-19T13:00",
                            "idTransportasi": "db560d3d-2cf0-442c-b02b-ff0af4f72d88",
                            "beratMuatan": "1"
                      }
        
        
        response = self.client.post(f'/company/shipment',  json = body, headers = {'Authorization': f'{ManajerPerusahaan}'} )
        print(response.json())

        # headers = {'Authorization': f'Bearer {token_dosen}'}
        # response = self.client.post("/certificates/approve/ijazah",  json = ijazah, headers = headers )
        # print(response.json())
        # response = self.client.post("/certificates/approve/transkrip",  json = transkrip, headers = headers )
        # print(response.json())