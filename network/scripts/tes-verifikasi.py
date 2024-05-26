from locust import HttpUser, task, between
import json
class TestCreateSupplyChain(HttpUser):
    wait_time = between(0.5, 3.0)
    host = 'http://34.101.232.196:8000/api/v1'


    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        # global manajer_perusahaan
        # global admin_perusahaan
      
        # response = self.client.post("/auth/login",  json= {"username": "manager","password": "123"})
        # print("res",response.json())
        # manajer_perusahaan = response.json()['data']['token']
        # response = self.client.post("/auth/login",  json = {"username": "company","password": "123"})
        # admin_perusahaan = response.json()['data']['token']

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        pass


    # @task(1)
    # def verifikasi_perjalanan(self):
    #     body = {
    #                 "identifier": {
    #                     "shipment" : "0fdd07c585769886ed3ddeeea78416e7cf138515c86cc9da1079c12f4ac59f84"
    #                 }
    #             }
    #     headers = {'Authorization': f'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkMDBkYjhhLTdiNDktNGJiOS05Y2IyLTI2NDIyOWM1NzE1OCIsInVzZXJuYW1lIjoibWFuYWplcjEiLCJlbWFpbCI6Im1hbmFqZXIxQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoibWFuYWdlci1wZXJ1c2FoYWFuIiwib3JnYW5pemF0aW9uTmFtZSI6InN1cHBseWNoYWluIiwibmlrIjoiIiwiaWREaXZpc2kiOiIzYTlhOGNkMC01ZjY3LTRkZGYtYTNmYi1lNjM0MmQ5MzA3ODEiLCJpZFBlcnVzYWhhYW4iOiJjNDFhODQ3Yi1iMTdlLTQwODctYjdmMi0zNDdhODE0MzA1YmUiLCJpZFBlcmphbGFuYW4iOltdLCJpYXQiOjE3MTY2NDgxNDIsImV4cCI6MTcxNjY1NTM0Mn0.Gh31CVK03_pmOt7NFP5bNwJ6s3UpBmRcRqNueFz69Wk'}
    #     response = self.client.post(f'/company/shipment/verify/',json=body , headers = headers )
       

      
    @task(1)
    def verifikasi_carbon_transaction(self):
        body = {
                "identifier": {
                    "carbonTransaction" : "de290ad331953925853cd029f7051e46188a70ad94ede746bf99dd14a80079d1"
                }
              }
       
        
        headers = {'Authorization': f'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmZGFiNjQ2LTc5YTEtNDk4ZC04YTc4LTU1ZWNkYzdlNDE0YyIsInVzZXJuYW1lIjoiY29tcGFueTEiLCJlbWFpbCI6ImNvbXBhbnkxQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoiYWRtaW4tcGVydXNhaGFhbiIsIm9yZ2FuaXphdGlvbk5hbWUiOiJzdXBwbHljaGFpbiIsImlkUGVydXNhaGFhbiI6ImM0MWE4NDdiLWIxN2UtNDA4Ny1iN2YyLTM0N2E4MTQzMDViZSIsImlhdCI6MTcxNjY0ODQ4MywiZXhwIjoxNzE2NjU1NjgzfQ.VKCuBjnUeLVSx1Ud4UGnPsJoeOCif-cw2ffsxHhDNcs'}
        response = self.client.post(f'/carbon_trading/transactions/verify',json=body, headers = headers )
        