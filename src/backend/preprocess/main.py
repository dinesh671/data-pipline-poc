from fastapi import FastAPI
from dotenv import load_dotenv
from mangum import Mangum
from models import SupplyChainRecord, UploadRequest
import boto3

load_dotenv

app = FastAPI()

s3 = boto3.resource('s3',region_name='ap-south-1')
Bucket = "data_pipe_line"


@app.post("/raw_file")
async def getFile(file:UploadRequest):
    
    
    return {"message": "please sent the file "}



handler = Mangum(app)