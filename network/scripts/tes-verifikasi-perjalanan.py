from locust import HttpUser, task, between
class TestVerifikasiPerjalanan(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """


    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass


    @task(1)
    def verifikasi_perjalanan(self):
        body = {
                    "identifier": {
                        "shipment" : "d94d849acd3e2bdae47662d309af73d124e6e16763661ac3bd08217f6bb4b667"
                    }
                }
        headers = {'Authorization': f'{"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5YTY3NWNmLWU5NTktNDIxOC1hZmEzLWUyNTJmNmE3YTU5MyIsInVzZXJuYW1lIjoibWFuYWdlciIsImVtYWlsIjoibWFuYWplckBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6Im1hbmFnZXItcGVydXNhaGFhbiIsIm9yZ2FuaXphdGlvbk5hbWUiOiJzdXBwbHljaGFpbiIsIm5payI6IiIsImlkRGl2aXNpIjoiMzZiZjZiMjgtMDViZi00NDdlLWEyZDctMzgxYWEzYjEzNTliIiwiaWRQZXJ1c2FoYWFuIjoiZTdkNDdlYWMtYzU2Yy00YzEwLWIxYTktYTc2NmJjYjFkOGY0IiwiaWRQZXJqYWxhbmFuIjpbXSwiaWF0IjoxNzE2MzQwMDMxLCJleHAiOjE3MTYzNDcyMzF9.TYwfJQ5ZVxaCMMvbytTyPDa5-jStzeFN-2x3gF-dQ1w"}'}
        response = self.client.post(f'/company/shipment/verify/',json=body , headers = headers )
       
        