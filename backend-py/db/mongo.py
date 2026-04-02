from pymongo import MongoClient
from models import userModel

class MongoDB:
    def __init__(self, uri: str):
        self.mongoclient = MongoClient(uri)
        self.database = self.mongoclient["main-db"]
        self.collection = self.database["user"]

    def addUserInfoToDB(self, userInfo: userModel.User):
        try:
            user_dict = userInfo.model_dump(mode="json")
            response = self.collection.insert_one(user_dict)
            
            return {
                "status": 201,
                "message": f"User with name : {userInfo.name} have been added to the database",
                "anotherValid": {"inserted_id": str(response.inserted_id)} 
            }
        except Exception as e:
            print(f"DB Error: {e}")
            return {
                "status": 501,
                "message": "Internal server error at adding user data to mongo db cloud",
                "anotherValid": str(e)
            }
    
    def retreieveUserInfo(self, **kwargs):
        try:
            response = self.collection.find_one(kwargs)
            
            if response:
                response["_id"] = str(response["_id"]) 
                
            return {
                "status": 200,
                "message": f"User with details as : {kwargs}'s data have been successfully retrieved",
                "anotherValid": response
            }
        except Exception as e:
            return {
                "status": 502,
                "message": f"Internal server error at retreiving data from the cloud with details as : {kwargs}",
                "anotherValid": str(e)
            }
    
    def updateUserInfo(self, user_id: str, **toBeupdatedList):
        try:
            update_op = {
                '$set': toBeupdatedList
            }
            response = self.collection.update_one({"user_id": user_id}, update_op)
            
            return {
                "status": 200,
                "message": f"successfully updated the data for user_id : {user_id}",
                "anotherValid": {"modified_count": response.modified_count}
            }
        except Exception as e:
            return {
                "status": 503,
                "message": f"Internal server error at update data onto the cloud for id : {user_id}",
                "anotherValid": str(e)
            }
    
    def getCollectionInstance(self):
        return self.collection
        
    def getMongoClient(self):
        return self.mongoclient
        
    def getDatabaseInstance(self):
        return self.database