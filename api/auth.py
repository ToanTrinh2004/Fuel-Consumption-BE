from __future__ import annotations

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from core.database import db
from core.models import User
from core.security import issue_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    payload = request.get_json(silent=True) or {}

    email = (payload.get("email") or "").strip().lower()
    password = (payload.get("password") or "").strip()
    full_name = (payload.get("full_name") or "").strip() or None

    if not email or not password:
        return jsonify({"error": "Email va mat khau la bat buoc"}), 400

    if len(password) < 8:
        return jsonify({"error": "Mat khau phai co it nhat 8 ky tu"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email da duoc su dung"}), 409

    password_hash = generate_password_hash(password)

    user = User(email=email, password_hash=password_hash, full_name=full_name)
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email da duoc su dung"}), 409

    token = issue_token(user)
    return (
        jsonify(
            {
                "message": "Dang ky thanh cong",
                "access_token": token,
                "token_type": "bearer",
            }
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}

    email = (payload.get("email") or "").strip().lower()
    password = (payload.get("password") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email va mat khau la bat buoc"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Thong tin dang nhap khong hop le"}), 401

    token = issue_token(user)
    return jsonify({"access_token": token, "token_type": "bearer"}), 200
