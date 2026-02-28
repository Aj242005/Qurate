from pymongo import MongoClient
from models import falseRes,trueRes,userModel

class MongoDB:
    
    
    
    def __init__( self, uri ):
        self.mongoclient = MongoClient(uri)
        self.database = self.mongoclient["main"]
        self.collection = self.database["user"]

    
    
    async def addUserInfoToDB(self, userInfo : userModel.User ) -> falseRes.ErrRes | trueRes.SuccessRes  :
        try:
            res = await self.collection.insert_one(userInfo)
            return {
                "status" : 201,
                "message" : f"User with name : {userInfo.name} have been added to the database",
                "anotherValid" : res
            }
        except Exception as e:
            return {
                "status" : 501,
                "message": f"Internal server error at adding user data to mongo db cloud",
                "anotherValid"  : e
            }
    

    
    async def retreieveUserInfo(self,user_id : str):
        try:
            res = await self.collection.find_one({"user_id": user_id})
            return {
                "status" : 200,
                "message" : f"User with user_id : {user_id}'s data have been successfully retrieved",
                "anotherValid" : res
            }
        except Exception as e:
            return {
                "status" : 502,
                "message": f"Internal server error at retreiving data from the cloud for id : {user_id}",
                "anotherValid"  : e
            }
    
    
    async def updateUserInfo(self,user_id : str, **toBeupdatedList):
        try:
            update_op = {
                '$set' : toBeupdatedList
            }
            res  = await self.collection.update_one({"user_id" : user_id},update_op)
            return {
                "status" : 200,
                "message" : f"successfully updated the data for user_id : {user_id}",
                "anotherValid" : res
            }
        except Exception as e:
            return {
                "status" : 503,
                "message": f"Internal server error at update data onto the cloud for id : {user_id}",
                "anotherValid"  : e
            }
    
    
    def getCollectionInstance(self):
        return self.collection
    def getMongoClient(self):
        return self.mongoclient
    def getDatabaseInstance(self):
        return self.database