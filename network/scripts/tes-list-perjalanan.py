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
        
        idPerusahaan = '6f8ec5b6-ea9b-4066-86b9-021479f7dac0'
        response = self.client.get(f'/company/shipment/company/{idPerusahaan}', headers = {'Authorization': f'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkMDBkYjhhLTdiNDktNGJiOS05Y2IyLTI2NDIyOWM1NzE1OCIsInVzZXJuYW1lIjoibWFuYWplcjEiLCJlbWFpbCI6Im1hbmFqZXIxQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoibWFuYWdlci1wZXJ1c2FoYWFuIiwib3JnYW5pemF0aW9uTmFtZSI6InN1cHBseWNoYWluIiwibmlrIjoiIiwiaWREaXZpc2kiOiIzYTlhOGNkMC01ZjY3LTRkZGYtYTNmYi1lNjM0MmQ5MzA3ODEiLCJpZFBlcnVzYWhhYW4iOiJjNDFhODQ3Yi1iMTdlLTQwODctYjdmMi0zNDdhODE0MzA1YmUiLCJpZFBlcmphbGFuYW4iOltdLCJpYXQiOjE3MTY5ODk3MzMsImV4cCI6MTcxNjk5NjkzM30.T7JYsFyC1lCLN7tEakijs5t_bCIcx2hOASACFgsouB0'} )
        print(response.json())
