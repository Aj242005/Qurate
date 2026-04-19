from pymongo import MongoClient
from models import userModel
import datetime


class MongoDB:
    def __init__(self, uri: str):
        self.mongoclient = MongoClient(uri)
        self.database = self.mongoclient["main-db"]
        self.collection = self.database["user"]
        self.chat_collection = self.database["chat_history"]

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
            update_op = {"$set": toBeupdatedList}
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
    def appendChatMessage(self, user_id: str, role: str, content: str, response_obj: dict) -> dict:
        """
        Appends one turn to the user's chat history.
        role: "user" | "assistant"
        content: the raw user prompt or assistant text summary
        response_obj: the full typed response dict {"type":..., "response":...}
        """
        try:
            turn = {
                "role": role,
                "content": content,
                "response": response_obj,
                "timestamp": datetime.datetime.utcnow().isoformat()
            }
            result = self.chat_collection.update_one(
                {"user_id": user_id},
                {
                    "$push": {"history": turn},
                    "$setOnInsert": {"user_id": user_id}
                },
                upsert=True
            )
            return {
                "status": 201,
                "message": "Chat turn appended",
                "anotherValid": {"modified": result.modified_count}
            }
        except Exception as e:
            return {
                "status": 504,
                "message": "Error appending chat message",
                "anotherValid": str(e)
            }

    def getChatHistory(self, user_id: str, limit: int = 20) -> dict:
        """Returns the last `limit` turns for a user."""
        try:
            doc = self.chat_collection.find_one({"user_id": user_id})
            if not doc:
                return {"status": 200, "message": "No history yet", "anotherValid": []}
            history = doc.get("history", [])
            return {
                "status": 200,
                "message": "Chat history retrieved",
                "anotherValid": history[-limit:]
            }
        except Exception as e:
            return {
                "status": 505,
                "message": "Error retrieving chat history",
                "anotherValid": str(e)
            }

    def clearChatHistory(self, user_id: str) -> dict:
        try:
            self.chat_collection.update_one(
                {"user_id": user_id},
                {"$set": {"history": []}}
            )
            return {"status": 200, "message": "Chat history cleared", "anotherValid": None}
        except Exception as e:
            return {"status": 506, "message": "Error clearing chat history", "anotherValid": str(e)}

    def getCollectionInstance(self):
        return self.collection

    def getMongoClient(self):
        return self.mongoclient

    def getDatabaseInstance(self):
        return self.database