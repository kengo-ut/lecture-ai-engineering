from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # モデル設定
    LLM_MODEL_NAME: str = "SakanaAI/TinySwallow-1.5B-Instruct"
    LLM_MAX_NEW_TOKENS: int = 1024
    SUPABASE_URL: str = "https://<your_project_id>.supabase.co"
    SUPABASE_KEY: str = "<your_project_key>"
    SESSIONS_TABLE: str = "sessions"
    MESSAGES_TABLE: str = "messages"

    model_config = SettingsConfigDict(
        env_file=".env",
    )


# インスタンス作成
settings = Settings()
