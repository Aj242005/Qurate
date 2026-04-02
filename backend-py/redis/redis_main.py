import redis.asyncio as redis
import json
from models import userModel, falseRes, trueRes

class RedisBasic:
    def __init__(self, host="localhost"):
        self.redisClient = redis.Redis(host=host, decode_responses=True)
    
    async def addRefreshTokenToRedis(self, refreshToken: str, email: str) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            key = f"refresh:{email}:{refreshToken}"
            await self.redisClient.set(key, "valid", ex=604800)
            return trueRes.SuccessRes(
                status=201,
                message="New refresh token is added to the redis client",
                anotherValid=True
            )
        except Exception as e:
            return falseRes.ErrRes(status=511, message="Error adding refresh token to the redis client", anotherValid=e)

    async def invalidateRefreshToken(self, refreshToken: str, email: str) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            key = f"refresh:{email}:{refreshToken}"
            await self.redisClient.delete(key)
            return trueRes.SuccessRes(
                status=201,
                message="Invalidated a refresh token",
                anotherValid=True
            )
        except Exception as e:
            return falseRes.ErrRes(status=511, message="Error invalidating refresh token", anotherValid=e)

    async def checkRefreshTokenStatus(self, refreshToken: str, email: str) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            key = f"refresh:{email}:{refreshToken}"
            response = await self.redisClient.get(key)
            is_valid = response is not None
            return trueRes.SuccessRes(
                status=200,
                message="Status of refresh token's validity",
                anotherValid=is_valid
            )
        except Exception as e:
            return falseRes.ErrRes(status=511, message="Error checking refresh token's status", anotherValid=e)

    async def addUserDataToRedis(self, user: userModel.User) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            user_json = user.model_dump_json()
            await self.redisClient.set(f"user:{user.email}", user_json, ex=1800)
            return trueRes.SuccessRes(
                status=201,
                message="successfully added the user to redis",
                anotherValid=True
            )
        except Exception as e:
            return falseRes.ErrRes(status=511, message="Error adding user data to the redis Client", anotherValid=e)

    async def getUserDetailsFromRedis(self, email: str) -> falseRes.ErrRes | trueRes.SuccessRes:
        try:
            response = await self.redisClient.get(f"user:{email}")
            if not response:
                return falseRes.ErrRes(status=404, message="User not found in cache", anotherValid=None)
            user_data = json.loads(response)
            return trueRes.SuccessRes(
                status=200,
                message="successfully retrieved the user data from redis",
                anotherValid=user_data,
            )
        except Exception as e:
            return falseRes.ErrRes(status=512, message="Error retrieving user data from the redis Client", anotherValid=e)