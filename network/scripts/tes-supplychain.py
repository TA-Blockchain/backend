from locust import HttpUser, task, between
import json

class TestSupplyChain(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'
    


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        # global AdminPerusahaan

        # response = self.client.post("/auth/login",  json = {"username": "company","password": "123"})
        # AdminPerusahaan = response.json()['data']['token']
         
    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass

    @task(1)
    def list_supply_chain(self):
        
        response = self.client.get(f'/company/supply_chain',  headers = {'Authorization': f'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmZGFiNjQ2LTc5YTEtNDk4ZC04YTc4LTU1ZWNkYzdlNDE0YyIsInVzZXJuYW1lIjoiY29tcGFueTEiLCJlbWFpbCI6ImNvbXBhbnkxQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoiYWRtaW4tcGVydXNhaGFhbiIsIm9yZ2FuaXphdGlvbk5hbWUiOiJzdXBwbHljaGFpbiIsImlkUGVydXNhaGFhbiI6ImM0MWE4NDdiLWIxN2UtNDA4Ny1iN2YyLTM0N2E4MTQzMDViZSIsImlhdCI6MTcxNjY0ODQ4MywiZXhwIjoxNzE2NjU1NjgzfQ.VKCuBjnUeLVSx1Ud4UGnPsJoeOCif-cw2ffsxHhDNcs'} )
        # print(response.json())
