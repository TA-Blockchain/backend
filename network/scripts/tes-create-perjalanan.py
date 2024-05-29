from locust import HttpUser, task, between
import json

class TestCreatePengajuan(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'
    


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        # global token
        # response = self.client.post("/auth/login",  json = {"username": "manager","password": "123"})
        # token = response.json()['data']['token']

        
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def create_dpengajuan(self):
        body =         {
                            "idSupplyChain": "3bed689e-3167-4691-a158-c69e9255fa23",
                            "idDivisiPenerima": "5a493038-87a4-42d0-b947-d0a50b4617a3",
                            "waktuBerangkat": "2024-08-19T13:00",
                            "idTransportasi": "5b7e9c03-e5ac-4a1c-93ea-cab12cc91271",
                            "beratMuatan": "1"
                        }
        
        
        response = self.client.post(f'/company/shipment',  json = body, headers = {'Authorization': f'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkMDBkYjhhLTdiNDktNGJiOS05Y2IyLTI2NDIyOWM1NzE1OCIsInVzZXJuYW1lIjoibWFuYWplcjEiLCJlbWFpbCI6Im1hbmFqZXIxQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoibWFuYWdlci1wZXJ1c2FoYWFuIiwib3JnYW5pemF0aW9uTmFtZSI6InN1cHBseWNoYWluIiwibmlrIjoiIiwiaWREaXZpc2kiOiIzYTlhOGNkMC01ZjY3LTRkZGYtYTNmYi1lNjM0MmQ5MzA3ODEiLCJpZFBlcnVzYWhhYW4iOiJjNDFhODQ3Yi1iMTdlLTQwODctYjdmMi0zNDdhODE0MzA1YmUiLCJpZFBlcmphbGFuYW4iOltdLCJpYXQiOjE3MTY5ODgzMDcsImV4cCI6MTcxNjk5NTUwN30.RYgccd6OzjPZGlQi27ZyF9uCRiqDLjyKERmHha2S9dk'} )
        print(response.json())
