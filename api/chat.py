from __future__ import annotations

import asyncio
from datetime import datetime
from typing import Any, Dict, List, Optional

from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload
from werkzeug.exceptions import InternalServerError

from core.database import db
from core.models import Conversation, Message, User
from core.security import token_required
from models.request import ChatRequest, ChatWithPredictionRequest, PredictionRequest
from models.response import ChatWithPredictionResponse, PredictionResponse, ChatResponse
from services import model_service
from services.llm_service import llm_service
from services.model_service import model_service
from core.supportfunc import extract_params,get_example_response


chat_bp = Blueprint("chat", __name__)

DEFAULT_BOT_REPLY = "Hien tai chua ket noi LM Studio"


def _message_to_dict(message: Message) -> Dict[str, Any]:
    return {
        "id": message.id,
        "conversation_id": message.conversation_id,
        "role": message.role,
        "content": message.content,
        "metadata": message.metadata_json,
        "created_at": message.created_at.isoformat() if message.created_at else None,
    }


def _conversation_to_dict(
    conversation: Conversation, include_messages: bool = False
) -> Dict[str, Any]:
    messages: List[Dict[str, Any]] = []
    last_message: Optional[Dict[str, Any]] = None

    if include_messages:
        messages = [_message_to_dict(msg) for msg in conversation.messages]
    elif conversation.messages:
        last_message = _message_to_dict(conversation.messages[-1])

    return {
        "id": conversation.id,
        "title": conversation.title,
        "user_id": conversation.user_id,
        "created_at": conversation.created_at.isoformat()
        if conversation.created_at
        else None,
        "updated_at": conversation.updated_at.isoformat()
        if conversation.updated_at
        else None,
        "last_message": last_message,
        "messages": messages if include_messages else None,
    }


@chat_bp.route("/conversations", methods=["POST"])
@token_required
def create_conversation(current_user: User):
    payload = request.get_json(silent=True) or {}

    user_id = payload.get("user_id")
    title = (payload.get("title") or "Cuoc tro chuyen moi").strip()

    if user_id and user_id != current_user.id:
        return jsonify({"error": "Khong duoc gan cuoc tro chuyen cho nguoi dung khac"}), 403

    conversation = Conversation(title=title, user_id=user_id or current_user.id)
    db.session.add(conversation)
    db.session.commit()

    return jsonify(_conversation_to_dict(conversation, include_messages=True)), 201


@chat_bp.route("/conversations", methods=["GET"])
@token_required
def list_conversations(current_user: User):
    conversations = (
        Conversation.query.options(joinedload(Conversation.messages))
        .filter(Conversation.user_id == current_user.id)
        .all() 
    )
    data = [_conversation_to_dict(conv, include_messages=False) for conv in conversations]
    return jsonify({"items": data, "total": len(data)})


@chat_bp.route("/conversations/<int:conversation_id>", methods=["GET"])
def get_conversation(conversation_id: int):
    conversation = (
        Conversation.query.options(joinedload(Conversation.messages))
        .filter_by(id=conversation_id)
        .first()
    )
    if not conversation:
        return jsonify({"error": "Conversation khong ton tai"}), 404

  

    return jsonify(_conversation_to_dict(conversation, include_messages=True))


@chat_bp.route("/conversations/<int:conversation_id>/messages", methods=["GET"])
@token_required
def list_messages(conversation_id: int, current_user: User):
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return jsonify({"error": "Conversation khong ton tai"}), 404

    if conversation.user_id != current_user.id:
        return jsonify({"error": "Khong the truy cap cuoc tro chuyen nay"}), 403

    messages = Message.query.filter_by(conversation_id=conversation_id).order_by(
        Message.created_at.asc(), Message.id.asc()
    )
    return jsonify({"items": [_message_to_dict(msg) for msg in messages]})


@chat_bp.route("/conversations/<int:conversation_id>/messages", methods=["POST"])
@token_required
def create_message(conversation_id: int, current_user: User):
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return jsonify({"error": "Conversation khong ton tai"}), 404

    if conversation.user_id != current_user.id:
        return jsonify({"error": "Khong the truy cap cuoc tro chuyen nay"}), 403

    payload = request.get_json(silent=True) or {}
    role = (payload.get("role") or "").strip().lower()
    content = (payload.get("content") or "").strip()
    metadata = payload.get("metadata")

    if role not in {"user", "assistant"}:
        return jsonify({"error": "Role khong hop le"}), 400

    if not content:
        return jsonify({"error": "Noi dung khong duoc de trong"}), 400

    message = Message(
        conversation_id=conversation.id,
        role=role,
        content=content,
        metadata_json=metadata,
    )
    db.session.add(message)
    conversation.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify(_message_to_dict(message)), 201


@chat_bp.route("/conversations/<int:conversation_id>", methods=["DELETE"])
@token_required
def delete_conversation(conversation_id: int, current_user: User):
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return jsonify({"error": "Conversation khong ton tai"}), 404

    if conversation.user_id != current_user.id:
        return jsonify({"error": "Khong the truy cap cuoc tro chuyen nay"}), 403

    db.session.delete(conversation)
    db.session.commit()

    return jsonify({"deleted": True})


@chat_bp.route("/conversations", methods=["DELETE"])
@token_required
def delete_all_conversations(current_user: User):
    conversations = Conversation.query.filter(Conversation.user_id == current_user.id).all()
    deleted = len(conversations)

    if deleted == 0:
        return jsonify({"deleted": 0})

    for conversation in conversations:
        db.session.delete(conversation)

    db.session.commit()
    return jsonify({"deleted": deleted})


@chat_bp.route("/predict", methods=["POST"])
def predict_endpoint():
    try:
        # Get JSON body from the request
        data = request.get_json()

        # Predict using your model service
        prediction = model_service.predict(data)

        # Build response JSON
        response = {
            "fuel_consumption": prediction,
            "parameters": data
        }

        return jsonify(response), 200

    except Exception as e:
        raise InternalServerError(description=f"Prediction error: {str(e)}")
    
@chat_bp.route("/chat", methods=["POST"])
def chat_with_auto_prediction():
    try:
        data = request.get_json()
        messages = data.get("messages", [])
        language = data.get("language", "en")
        context = data.get("context", [])
        conversation_id = data.get("conversation_id")
        conversation_id = int(conversation_id)
        print(context)
        if isinstance(context, list) and context:
            messages = context + messages
        test =   get_conversation(conversation_id)
        print("test conversation",test)
        data = test.get_json()  
        user_message_content = messages[-1].get("content", "")
        print("test get conversation")
        print(data["messages"]) 
        extracted = extract_params(user_message_content.lower(), conversation_id, db.session)
        # store new message of user to DB
        user_msg = Message(
        conversation_id=conversation_id,
        role="user",
        content=user_message_content
        )
        db.session.add(user_msg)
        db.session.commit()
        
        response_payload: Dict[str, Any]
        if extracted is False:
            user_message = user_message_content.lower()
            response = get_example_response(db.session, user_message)
            if response is not None:
                assistant_reply = response
                response_payload = {"response": response}
            else:
                llm_response = asyncio.run(llm_service.chat(messages, "vi"))
                assistant_reply = llm_response
                response_payload = {"response": llm_response}
        else:
            print("Extracted parameters:")
            print(extracted)
            assistant_reply = extracted.get("llm_response", "")
            response_payload = extracted
        assistant_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=str(assistant_reply)
        )
        db.session.add(assistant_msg)
        db.session.commit()
        return jsonify(response_payload)
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise InternalServerError(description=f"Prediction error: {str(e)}")
