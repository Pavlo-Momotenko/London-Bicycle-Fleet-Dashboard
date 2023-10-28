from flask import Flask
from werkzeug.exceptions import HTTPException

from src.config import Config
from src.http.exception import http_exception_handler
from src.models.db_obj import db

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

app.register_error_handler(HTTPException, http_exception_handler)

from src.api.urls import api_urls_blueprint  # noqa: E402

app.register_blueprint(api_urls_blueprint)
