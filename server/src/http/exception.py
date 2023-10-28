from http import HTTPStatus

from werkzeug.exceptions import HTTPException

from src.http.error import HttpErrorResponse


class HttpException(HTTPException):
    def __init__(
        self,
        message: str,
        description: str | None = None,
        status: HTTPStatus = HTTPStatus.BAD_REQUEST,
    ):
        super().__init__(
            description, response=HttpErrorResponse(message, description, status)
        )


def http_exception_handler(exception: HttpException):
    message = exception.name
    description = exception.description
    status = exception.code or HTTPStatus.BAD_REQUEST
    return HttpErrorResponse(message, description, status)
