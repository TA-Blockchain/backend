from locust import HttpUser, task, between

class TestIdentifierPerjalanan(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """


    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass


    @task(1)
    def identifier_perjalanan(self):
        
        headers = {'Authorization': f'{"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5YTY3NWNmLWU5NTktNDIxOC1hZmEzLWUyNTJmNmE3YTU5MyIsInVzZXJuYW1lIjoibWFuYWdlciIsImVtYWlsIjoibWFuYWplckBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6Im1hbmFnZXItcGVydXNhaGFhbiIsIm9yZ2FuaXphdGlvbk5hbWUiOiJzdXBwbHljaGFpbiIsIm5payI6IiIsImlkRGl2aXNpIjoiMzZiZjZiMjgtMDViZi00NDdlLWEyZDctMzgxYWEzYjEzNTliIiwiaWRQZXJ1c2FoYWFuIjoiZTdkNDdlYWMtYzU2Yy00YzEwLWIxYTktYTc2NmJjYjFkOGY0IiwiaWRQZXJqYWxhbmFuIjpbXSwiaWF0IjoxNzE2MzQwMDMxLCJleHAiOjE3MTYzNDcyMzF9.TYwfJQ5ZVxaCMMvbytTyPDa5-jStzeFN-2x3gF-dQ1w"}'}
        idPerjalanan='9d98d43f-ef23-4e87-8556-fc60af0778ab'
        response = self.client.post(f'/company/shipment/identifier/{idPerjalanan}', headers = headers )
        print(response.json())

      
