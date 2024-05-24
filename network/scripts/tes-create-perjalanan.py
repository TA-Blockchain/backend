from locust import HttpUser, task, between
import json

class TestCreatePengajuan(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'
    


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global token
        response = self.client.post("/auth/login",  json = {"username": "manager","password": "123"})
        token = response.json()['data']['token']

        
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def create_dpengajuan(self):
        body =         {
                            "idSertifikat": "856b4063-20e2-4b6d-a3f4-4c3d205f4f0e",
                            "status": "Menunggu Persetujuan Bank",
                            "idPembeli":  "19d738ba-fe56-4bc1-887e-cc3856238fa7",
                            "idPenjual": "36cf204f-58f3-44a8-8b9a-49e63d847821"
                        }
        
        
        response = self.client.post(f'/dokumen',  json = body, headers = {'Authorization': f'{token}'} )
        print(response.json())
