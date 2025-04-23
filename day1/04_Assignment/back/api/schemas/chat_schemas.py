from pydantic import BaseModel


class ChatResponse(BaseModel):
    content: str


class Message(BaseModel):
    message_id: str
    role: str
    content: str
    created_at: str


class DBResponse(BaseModel):
    status: str
    message: str


class Session(BaseModel):
    session_id: str
    title: str
    created_at: str
