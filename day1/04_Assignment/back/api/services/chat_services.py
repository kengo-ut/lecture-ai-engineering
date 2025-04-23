from fastapi import HTTPException

from api.clients import db_client, llm_client
from api.schemas import ChatResponse, DBResponse, Message, Session


class ChatService:
    @staticmethod
    def generate_chat_response_from_messages(messages: list[Message]) -> ChatResponse:
        # メッセージをフォーマット
        messages_formatted: list[dict[str, str]] = [
            {"role": message.role, "content": message.content} for message in messages
        ]

        # LLM から応答を生成
        content: str | None = llm_client.generate_response_from_messages(
            messages_formatted
        )

        if content is None:
            raise HTTPException(
                status_code=500, detail="Failed to generate response from LLM"
            )

        return ChatResponse(content=content)

    @staticmethod
    def create_new_session(session: Session) -> DBResponse:
        # セッションを作成
        response: DBResponse = db_client.create_session_in_db(
            session.session_id, session.title, session.created_at
        )
        return response

    @staticmethod
    def save_messages_in_session(
        session_id: str, messages: list[Message]
    ) -> DBResponse:
        # セッション内のメッセージを保存
        response: DBResponse = db_client.save_messages_for_session(session_id, messages)
        return response

    @staticmethod
    def get_messages_from_session(session_id: str) -> list[Message]:
        # セッションからメッセージを取得
        messages = db_client.fetch_messages_from_session(session_id)
        return messages

    @staticmethod
    def get_sessions() -> list[Session]:
        # 全セッションを取得
        sessions = db_client.fetch_sessions()
        return sessions
