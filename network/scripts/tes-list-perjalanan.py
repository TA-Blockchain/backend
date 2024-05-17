from locust import HttpUser, task, between

class TestListPerjalanan(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'
    


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        global ManajerPerusahaan

        response = self.client.post("/auth/login",  json = {"username": "mmm","password": "123"})
        ManajerPerusahaan = response.json()['data']['token']

        
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def list_shipment(self):
        
        idPerusahaan = '5a8e4171-29ed-4d2d-8967-cf425e89348b'
        response = self.client.get(f'/company/shipment/company/{idPerusahaan}', headers = {'Authorization': f'{ManajerPerusahaan}'} )
        print(response.json())
