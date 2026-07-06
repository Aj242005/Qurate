import redis
import os
from models import userModel, falseRes, trueRes

class RedisBasic:
    def __init__(self, host=None):
        host = host or os.getenv("REDIS_HOST", "localhost")
        self.redisClient = redis.Redis(host=host, decode_responses=True)
    
    def addRefreshTokenToRedis(self, refreshToken: str, email: str) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            response = self.redisClient.hset(f'refresh:{email}', mapping={refreshToken: "True"})
            self.redisClient.expire(f'refresh:{email}', 604800)
            return trueRes.SuccessRes(
                status=201,
                message="New refresh token is added to the redis client",
                anotherValid=response
            )
        except Exception as e:
            return falseRes.ErrRes(
                status=511,
                message="Error adding refresh token to the redis client",
                anotherValid=e
            )

    def invalidateRefreshToken(self, refreshToken: str, email: str) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            response = self.redisClient.hset(f'refresh:{email}', mapping={refreshToken: "False"})
            self.redisClient.expire(f'refresh:{email}', 604800)
            return trueRes.SuccessRes(
                status=201,
                message="Invalidated a refresh token",
                anotherValid=response
            )
        except Exception as e:
            return falseRes.ErrRes(
                status=511,
                message="Error invalidating refresh token",
                anotherValid=e
            )

    def checkRefreshTokenStatus(self, refreshToken: str, email: str) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            response = self.redisClient.hget(f'refresh:{email}', refreshToken)
            return trueRes.SuccessRes(
                status=200,
                message="Status of refresh token's validity",
                anotherValid=True if response in ("True", "true", "1") else False
            )
        except Exception as e:
            return falseRes.ErrRes(
                status=511,
                message="Error checking refresh token's status",
                anotherValid=e
            )

    def addUserDataToRedis(self, user: userModel.User) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            safe_mapping = {k: str(v) for k, v in user.model_dump().items() if v is not None}
            response = self.redisClient.hset(f'user:{user.email}', mapping=safe_mapping)
            self.redisClient.expire(f'user:{user.email}', time=1800)
            return trueRes.SuccessRes(
                status=201,
                message="successfully added the user to redis",
                anotherValid=response
            )
        except Exception as e:
            return falseRes.ErrRes(
                status=511,
                message="Error adding user data to the redis Client",
                anotherValid=e 
            )

    def getUserDetailsFromRedis(self, email: str) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            response = self.redisClient.hgetall(f'user:{email}')
            return trueRes.SuccessRes(
                status=200,
                message="successfully retrieved the user data from redis",
                anotherValid=response,
            )
        except Exception as e:
            return falseRes.ErrRes(
                status=512,
                message="Error retrieving user data from the redis Client",
                anotherValid=e 
            )