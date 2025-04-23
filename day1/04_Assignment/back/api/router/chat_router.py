from fastapi import APIRouter, HTTPException

from api.schemas import ChatResponse, DBResponse, Message, Session
from api.services import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/response", response_model=ChatResponse)
async def generate_response(messages: list[Message]):
    try:
        # サービス層のメソッドを呼び出す
        response: ChatResponse = ChatService.generate_chat_response_from_messages(
            messages
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/session", response_model=DBResponse)
async def create_session(request: Session):
    try:
        # サービス層のメソッドを呼び出す
        response: DBResponse = ChatService.create_new_session(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/session/{session_id}/messages", response_model=DBResponse)
async def save_messages(session_id: str, messages: list[Message]):
    try:
        # サービス層のメソッドを呼び出す
        response: DBResponse = ChatService.save_messages_in_session(
            session_id, messages
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}", response_model=list[Message])
async def retrieve_messages(session_id: str):
    try:
        # サービス層のメソッドを呼び出す
        messages: list[Message] = ChatService.get_messages_from_session(session_id)
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session", response_model=list[Session])
async def retrieve_sessions():
    try:
        # サービス層のメソッドを呼び出す
        sessions: list[Session] = ChatService.get_sessions()
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
