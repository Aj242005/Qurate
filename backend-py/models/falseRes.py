from pydantic import BaseModel, Field
from typing import Annotated, Any

class ErrRes(BaseModel):
    status: Annotated[
        int,
        Field(
            default=400,
            description="HTTP status code for the error response"
        )
    ]
    
    message: Annotated[
        str,
        Field(
            description="Description of the error that occurred"
        )
    ]
    
    anotherValid: Annotated[
        Any | None,
        Field(
            default=None,
            description="Any other valid supporting object"
        )
    ]