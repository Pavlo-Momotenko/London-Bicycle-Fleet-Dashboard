import json
from http import HTTPStatus

from flask import Response


class HttpResponse(Response):
    default_mimetype = "application/json"
    json_module = json

    def __init__(self, content: ... = None, status: HTTPStatus = HTTPStatus.OK):
        super().__init__(
            response=json.dumps(content), status=status, mimetype=self.default_mimetype
        )
