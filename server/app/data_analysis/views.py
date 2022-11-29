from flask import make_response, jsonify, request
from flask.views import MethodView

from app.models import db


class NearestToPoint(MethodView):
    init_every_request = False
    methods = ["POST"]

    def post(self):
        lat = float(request.form.get('latitude'))
        lon = float(request.form.get('longitude'))

        raw_query = """
            select name, latitude, longitude,  sqrt(
                pow(111.139 * (bicycle_station.latitude - {lat}), 2) +
                pow(111.139 * ({lon} - bicycle_station.longitude) * COS(latitude / 57.3), 2)
                ) as meters_distance
            from bicycle_station
            order by meters_distance
            limit 3;
         """

        return make_response(
            jsonify(
                [
                    {
                        'name': i[0],
                        'lat': round(i[1], 2),
                        'lon': round(i[2], 2),
                        'meters_distance': round(i[3], 2)
                    } for i in db.engine.execute(raw_query.format(lat=lat, lon=lon))
                ]
            )
        )
