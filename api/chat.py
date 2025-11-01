from __future__ import annotations

import asyncio
from http.client import HTTPException
from typing import Any, Dict, List, Optional
from werkzeug.exceptions import InternalServerError

from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload

from core.database import db
from core.models import Conversation, Message, User
from core.security import token_required
from models.request import ChatRequest, ChatWithPredictionRequest, PredictionRequest
from models.response import ChatWithPredictionResponse, PredictionResponse, ChatResponse
from services import model_service
from services.llm_service import llm_service
from services.model_service import model_service


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
@token_required
def get_conversation(conversation_id: int, current_user: User):
    conversation = (
        Conversation.query.options(joinedload(Conversation.messages))
        .filter_by(id=conversation_id)
        .first()
    )
    if not conversation:
        return jsonify({"error": "Conversation khong ton tai"}), 404

    if conversation.user_id != current_user.id:
        return jsonify({"error": "Khong the truy cap cuoc tro chuyen nay"}), 403

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
        print(context)
        if isinstance(context, list) and context:
            messages = context + messages

        #  Get LLM response
        llm_response = asyncio.run(llm_service.chat(messages, language))

        # Check if function call
        is_function_call, params = llm_service.parse_function_call(llm_response)

        prediction_result = None
        final_response = llm_response

        if is_function_call and params:
            #  Make prediction
            prediction_value = model_service.predict(params)

            #  Format message based on language
            if language.lower() == "vi":
                print("Vietnamese detected")
                assistant_message = (
                    f"Bạn Phải trả lời Hoàn Toàn bằng tiếng Việt. Tuyệt đối không được sử dụng tiếng Anh. "
                    f"Dựa trên các thông số chuyến đi của bạn, mô hình dự đoán đã tính toán "
                    f"mức tiêu thụ nhiên liệu là **{prediction_value:.2f} đơn vị**.\n\n"
                    f"Bây giờ để tôi giải thích ý nghĩa của kết quả này và những yếu tố nào đã ảnh hưởng đến dự đoán..."
                )
                elaboration_prompt = "Vui lòng giải thích chi tiết về dự đoán này với những thông tin hữu ích."
            else:
                assistant_message = (
                    f"Based on your trip parameters, the prediction model calculated "
                    f"a fuel consumption of **{prediction_value:.2f} liters**.\n\n"
                    f"Now let me explain what this means and what factors influenced this prediction..."
                )
                elaboration_prompt = "Please elaborate on this prediction with helpful insights."

            result_messages = messages + [{"role": "assistant", "content": assistant_message}]

            #  Get natural language explanation
            elaboration_messages = result_messages + [{"role": "user", "content": elaboration_prompt}]
            final_response = asyncio.run(llm_service.chat(elaboration_messages, language))

            prediction_result = {
                "fuel_consumption": prediction_value,
                "parameters": params
            }
        else:
            print("No function call detected, returning original LLM response")

        print(f"Returning response - prediction_made: {is_function_call}")

        return jsonify({
            "response": final_response,
            "prediction_made": is_function_call,
            "prediction_result": prediction_result
        }), 200

    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise InternalServerError(description=f"Prediction error: {str(e)}")