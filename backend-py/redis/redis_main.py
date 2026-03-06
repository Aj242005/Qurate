import redis
from models import userModel
class RedisBasic:
    def __init__(self,host = "localhost"):
        self.redisClient = redis.Redis(host=host,decode_responses=True)
    
    def addUserDataToRedis(self,user : userModel.User):