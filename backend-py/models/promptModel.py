from pydantic import BaseModel, Field
from typing import Annotated, Any, Literal


class PromptRequest(BaseModel):
    prompt: Annotated[str, Field(description="Natural language query from the user", min_length=1)]


# ── The three output shapes ──────────────────────────────────────────────────

class TextResponse(BaseModel):
    type: Literal["text"]
    response: str


class TablePayload(BaseModel):
    columns: list[str]
    rows: list[list[Any]]


class TableResponse(BaseModel):
    type: Literal["table"]
    response: TablePayload


class GraphPayload(BaseModel):
    x: list[Any]
    y: list[Any]
    x_label: str = ""
    y_label: str = ""


class GraphResponse(BaseModel):
    type: Literal["graph"]
    response: GraphPayload


# Union used as the route's response_model
PromptResponse = TextResponse | TableResponse | GraphResponse