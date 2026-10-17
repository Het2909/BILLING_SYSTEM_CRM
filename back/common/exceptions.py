import logging

from rest_framework.views import exception_handler


logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    view = context.get("view")
    request = context.get("request")

    logger.warning(
        "API exception",
        extra={
            "view": view.__class__.__name__ if view else None,
            "path": request.path if request else None,
            "method": request.method if request else None,
            "status_code": response.status_code if response else 500,
        },
        exc_info=exc,
    )

    if response is None:
        return response

    if isinstance(response.data, dict):
        response.data.setdefault("status_code", response.status_code)
        return response

    response.data = {
        "detail": response.data,
        "status_code": response.status_code,
    }

    return response
