import redis
from models import userModel,falseRes,trueRes
class RedisBasic:
    def __init__(self,host = "localhost"):
        self.redisClient = redis.Redis(host=host,decode_responses=True)

    def addUserDataToRedis(self,user : userModel.User)-> falseRes.ErrRes | trueRes.SuccessRes :
        try:
            response = self.redisClient.hset(f'user:{user.user_id}',mapping=user.model_dump())
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
    def getUserDetailsFromRedis(self, user_id : str) -> falseRes.ErrRes | trueRes.SuccessRes :
        try:
            response = self.redisClient.hgetall(f'user:{user_id}')
            return trueRes.SuccessRes(
                status=200,
                message="successfully retrieved the user data from redis",
                anotherValid=response,
            )
        except Exception as e:
            return falseRes.ErrRes(
                status = 512,
                message = "Error retrieving user data from the redis Client",
                anotherValid = e 
            )
