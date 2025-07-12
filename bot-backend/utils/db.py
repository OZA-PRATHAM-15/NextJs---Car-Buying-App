from pymongo import MongoClient
import os

def get_database():
    connection_string = os.getenv("MONGO_URI", "mongodb+srv://prathamoza10:HhtjumLu1wIxVZdM@carbuying.qkw1h2s.mongodb.net/?retryWrites=true&w=majority&appName=carbuying")
    client = MongoClient(connection_string)
    return client["test"]
