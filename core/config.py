import os
from dataclasses import dataclass

from dotenv import load_dotenv

# Load environment variables from .env file if present.
load_dotenv()


@dataclass(frozen=True)
class Settings:
    database_url: str
    secret_key: str


def _normalize_database_url(url: str) -> str:
    """Ensure SQLAlchemy uses the psycopg driver instead of psycopg2."""
    if "+psycopg" in url:
        return url
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def load_settings() -> Settings:
    """Load core application settings from environment variables."""
    database_url = os.environ.get("SUPABASE_DB_URL")
    if not database_url:
        raise RuntimeError("SUPABASE_DB_URL environment variable is required")

    secret_key = os.environ.get("SECRET_KEY", "change-me")
    return Settings(
        database_url=_normalize_database_url(database_url),
        secret_key=secret_key,
    )
