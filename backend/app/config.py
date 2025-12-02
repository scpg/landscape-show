"""Application configuration."""

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    """Application settings."""

    app_name: str = "Landscape Show"
    app_version: str = "0.1.0"
    data_dir: Path = Path("data")
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
