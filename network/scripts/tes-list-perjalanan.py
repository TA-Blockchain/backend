from locust import HttpUser, task, between

class TestListPerjalanan(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'
    


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        # global ManajerPerusahaan

        # response = self.client.post("/auth/login",  json = {"username": "manager","password": "123"})
        # ManajerPerusahaan = response.json()['data']['token']

        
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def list_shipment(self):
        
        idPerusahaan = 'c41a847b-b17e-4087-b7f2-347a814305be'
        response = self.client.get(f'/company/shipment/company/{idPerusahaan}', headers = {'Authorization': f'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkMDBkYjhhLTdiNDktNGJiOS05Y2IyLTI2NDIyOWM1NzE1OCIsInVzZXJuYW1lIjoibWFuYWplcjEiLCJlbWFpbCI6Im1hbmFqZXIxQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoibWFuYWdlci1wZXJ1c2FoYWFuIiwib3JnYW5pemF0aW9uTmFtZSI6InN1cHBseWNoYWluIiwibmlrIjoiIiwiaWREaXZpc2kiOiIzYTlhOGNkMC01ZjY3LTRkZGYtYTNmYi1lNjM0MmQ5MzA3ODEiLCJpZFBlcnVzYWhhYW4iOiJjNDFhODQ3Yi1iMTdlLTQwODctYjdmMi0zNDdhODE0MzA1YmUiLCJpZFBlcmphbGFuYW4iOltdLCJpYXQiOjE3MTY2NDgxNDIsImV4cCI6MTcxNjY1NTM0Mn0.Gh31CVK03_pmOt7NFP5bNwJ6s3UpBmRcRqNueFz69Wk'} )
        print(response.json())
