import json
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# you need to run the backend.py as well, so you get new data

# create API
api = FastAPI()

# allow CORS
api.add_middleware(CORSMiddleware, allow_origins=['*'])


@api.get("/api/")
def read_root():
    # parse data.json and return it as a response
    with open("./data/data.json", "r") as dataJSON:
        response = json.load(dataJSON)
        return response
