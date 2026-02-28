from pydantic import BaseModel, Field
from typing import Annotated, Any

class SuccessRes(BaseModel):
    status: Annotated[int, Field(
        default=200,
        description="This is the HTTP status code. This is used to provide an early categorization of response"
    )]
    message: Annotated[str, Field(
        description="This is the description which is a required thing for a successful response"
    )]
    anotherValid: Annotated[Any | None, Field(
        default=None,
        description="Any other valid supporting object"
    )]