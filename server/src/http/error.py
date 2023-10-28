import json
from http import HTTPStatus

from flask import Response


class HttpErrorResponse(Response):
    default_mimetype = "application/json"
    json_module = json

    def __init__(
        self,
        message: str,
        description: str | None = None,
        status: HTTPStatus = HTTPStatus.BAD_REQUEST,
    ):
        content = dict(
            message=message,
            details=description,
        )
        super().__init__(
            response=json.dumps(content), status=status, mimetype=self.default_mimetype
        )
