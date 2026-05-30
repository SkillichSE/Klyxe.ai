from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Klyxe API"
    environment: str = "development"
    frontend_origin: str = "http://localhost:5173"

    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 15
    refresh_token_days: int = 30

    s3_endpoint: str | None = None
    s3_bucket: str = "klyxe"
    s3_access_key: str | None = None
    s3_secret_key: str | None = None
    s3_region: str = "auto"
    llm_api_base: str = "https://openrouter.ai/api/v1"
    llm_api_key: str | None = None
    llm_default_model: str = "openai/gpt-4o-mini"
    llm_http_referer: str | None = None
    llm_title: str = "Klyxe RAG"

    @field_validator("jwt_secret")
    @classmethod
    def check_not_default(cls, v: str) -> str:
        WEAK = {"change-me", "changeme", "secret", "password", "default", "123456"}
        if v.strip().lower() in WEAK or len(v) < 16:
            raise ValueError("jwt_secret too short or known weak value")
        return v

    @field_validator("database_url")
    @classmethod
    def check_db_url(cls, v: str) -> str:
        if v.strip().lower() in {"", "sqlite://", "sqlite:///:memory:"}:
            raise ValueError("invalid database_url")
        return v


settings = Settings()
