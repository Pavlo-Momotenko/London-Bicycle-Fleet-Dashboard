import json
from http import HTTPStatus
from typing import Any

from flask import Response


class HttpResponse(Response):
    default_mimetype = "application/json"
    json_module = json

    def __init__(self, content: Any = None, status: HTTPStatus = HTTPStatus.OK):
        super().__init__(
            response=json.dumps(content), status=status, mimetype=self.default_mimetype
        )
