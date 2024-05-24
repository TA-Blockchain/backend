from locust import HttpUser, task, between

class TestVerifikasiCarbonTransaction(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """


    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass


      
    @task(1)
    def verifikasi_carbon_transaction(self):
        body = {
                "identifier": {
                    "carbonTransaction" : "a900cc30ec9e949d8feddb67a5e22f4de63d3ecfc76abeaccf0000eeb4023c6a"
                }
              }
       
        
        headers = {'Authorization': f'{"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyYjVmZjA5LWNmMGMtNDI3OS04OGIyLWQ4MjYyZjdhNDgyYiIsInVzZXJuYW1lIjoiY29tcGFueSIsImVtYWlsIjoiY29tcGFueUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImFkbWluLXBlcnVzYWhhYW4iLCJvcmdhbml6YXRpb25OYW1lIjoic3VwcGx5Y2hhaW4iLCJpZFBlcnVzYWhhYW4iOiJlN2Q0N2VhYy1jNTZjLTRjMTAtYjFhOS1hNzY2YmNiMWQ4ZjQiLCJpYXQiOjE3MTYzMzk3ODEsImV4cCI6MTcxNjM0Njk4MX0.dPdD0hti8-1bjaVujzA1fmMW8t0vpDLp8nfI97tfOlk"}'}
        response = self.client.post(f'/carbon_trading/transactions/verify',json=body, headers = headers )
        