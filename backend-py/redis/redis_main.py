import redis
from models import userModel,falseRes,trueRes
class RedisBasic:
    def __init__(self,host = "localhost"):
        self.redisClient = redis.Redis(host=host,decode_responses=True)
    
    def addUserDataToRedis(self,user : userModel.User)-> falseRes.ErrRes | trueRes.SuccessRes :
        try:
            response = self.redisClient.hset(f'user:{user.user_id}',mapping=user)
            return trueRes.SuccessRes(
                status = 201,
                message = "successfully added the user to redis",
                anotherValid = response
            )
        except Exception as e:
            return falseRes.ErrRes(
                status = 511,
                message = "Error adding user data to the redis Client",
                anotherValid = e 
            )