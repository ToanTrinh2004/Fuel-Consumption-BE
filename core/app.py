from flask import Flask, render_template
from flask_cors import CORS
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from api.auth import auth_bp
from api.chat import chat_bp
from core.config import load_settings
from core.database import db


def create_app() -> Flask:
    app = Flask(__name__)
    settings = load_settings()

    app.config.update(
        SQLALCHEMY_DATABASE_URI=settings.database_url,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SECRET_KEY=settings.secret_key,
    )

    # Enable CORS for all routes; tighten origins in production if needed.
    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)

    with app.app_context():
        # Import models so SQLAlchemy is aware of them before creating tables.
        from core import models  # noqa: F401

        db.create_all()

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(chat_bp, url_prefix="/chat")

    @app.route("/")
    def index():
        # Simple HTML page to manually interact with the API during development.
        return render_template("chat_test.html")

    return app


def check_connection(app: Flask) -> bool:
    try:
        with app.app_context():
            db.session.execute(text("SELECT 1"))
        return True
    except SQLAlchemyError:
        return False
