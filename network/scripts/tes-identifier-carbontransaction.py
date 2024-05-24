from locust import HttpUser, task, between

class TestIdentifierCarbonTransaction(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """


    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

      
    @task(1)
    def identifier_carbon_transaction(self):
        headers = {'Authorization': f'{"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyYjVmZjA5LWNmMGMtNDI3OS04OGIyLWQ4MjYyZjdhNDgyYiIsInVzZXJuYW1lIjoiY29tcGFueSIsImVtYWlsIjoiY29tcGFueUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImFkbWluLXBlcnVzYWhhYW4iLCJvcmdhbml6YXRpb25OYW1lIjoic3VwcGx5Y2hhaW4iLCJpZFBlcnVzYWhhYW4iOiJlN2Q0N2VhYy1jNTZjLTRjMTAtYjFhOS1hNzY2YmNiMWQ4ZjQiLCJpYXQiOjE3MTYzMzk3ODEsImV4cCI6MTcxNjM0Njk4MX0.dPdD0hti8-1bjaVujzA1fmMW8t0vpDLp8nfI97tfOlk"}'}
        idCt='859dbf54-39b3-43cc-8c6a-8b8937b12c9f'
        response = self.client.post(f'/carbon_trading/transactions/identifier/{idCt}', headers = headers )
        print(response.json())