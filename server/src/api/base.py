from flask.views import MethodView


class BaseAPI(MethodView):
    init_every_request = False
