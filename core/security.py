from __future__ import annotations

from functools import wraps
from typing import Any, Callable, ParamSpec, TypeVar

from flask import current_app, jsonify, request
from itsdangerous import BadSignature, BadTimeSignature, SignatureExpired, URLSafeTimedSerializer

from core.models import User

TOKEN_SALT = "auth-token"
TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7  # 7 days

P = ParamSpec("P")
R = TypeVar("R")


def _get_serializer() -> URLSafeTimedSerializer:
    secret = current_app.config["SECRET_KEY"]
    return URLSafeTimedSerializer(secret_key=secret, salt=TOKEN_SALT)


def issue_token(user: User) -> str:
    payload = {"sub": user.id, "email": user.email}
    return _get_serializer().dumps(payload)


def verify_token(token: str) -> dict[str, Any]:
    return _get_serializer().loads(token, max_age=TOKEN_MAX_AGE_SECONDS)


def token_required(func: Callable[P, R]) -> Callable[P, R]:
    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization header missing or invalid"}), 401  # type: ignore[return-value]

        token = auth_header.split(" ", 1)[1].strip()
        if not token:
            return jsonify({"error": "Token is required"}), 401  # type: ignore[return-value]

        try:
            payload = verify_token(token)
        except SignatureExpired:
            return jsonify({"error": "Token het han"}), 401  # type: ignore[return-value]
        except (BadSignature, BadTimeSignature):
            return jsonify({"error": "Token khong hop le"}), 401  # type: ignore[return-value]

        user_id = payload.get("sub")
        if not user_id:
            return jsonify({"error": "Token khong hop le"}), 401  # type: ignore[return-value]

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Nguoi dung khong ton tai"}), 401  # type: ignore[return-value]

        kwargs["current_user"] = user
        return func(*args, **kwargs)

    return wrapper
