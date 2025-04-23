from fastapi import HTTPException
from supabase import create_client

from api.schemas import DBResponse, Message, Session
from api.settings import settings


class DBClient:
    def __init__(self):
        self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    def create_session_in_db(
        self, session_id: str, title: str, created_at: str
    ) -> DBResponse:
        try:
            response = (
                self.client.table(settings.SESSIONS_TABLE)
                .insert(
                    {"session_id": session_id, "title": title, "created_at": created_at}
                )
                .execute()
            )
            return DBResponse(status="success", message="Session created successfully")
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to create session: {str(e)}"
            )

    def save_messages_for_session(
        self, session_id: str, messages: list[Message]
    ) -> DBResponse:
        try:
            # セッションに紐づくメッセージを削除
            self.client.table(settings.MESSAGES_TABLE).delete().eq(
                "session_id", session_id
            ).execute()

            # メッセージを一括挿入
            message_data = [message.model_dump() for message in messages]
            message_data = [
                {"session_id": session_id, **message} for message in message_data
            ]
            self.client.table(settings.MESSAGES_TABLE).insert(message_data).execute()

            return DBResponse(status="success", message="Messages saved successfully")
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to save messages: {str(e)}"
            )

    def fetch_messages_from_session(self, session_id: str) -> list[Message]:
        try:
            response = (
                self.client.table(settings.MESSAGES_TABLE)
                .select("*")
                .eq("session_id", session_id)
                .execute()
            )

            messages: list[Message] = [Message(**message) for message in response.data]
            # `created_at` で並べ替え
            return sorted(messages, key=lambda x: x.created_at)

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to fetch messages: {str(e)}"
            )

    def fetch_sessions(self) -> list[Session]:
        try:
            response = self.client.table(settings.SESSIONS_TABLE).select("*").execute()
            sessions = [Session(**session) for session in response.data]
            return sessions
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to fetch sessions: {str(e)}"
            )


db_client = DBClient()
