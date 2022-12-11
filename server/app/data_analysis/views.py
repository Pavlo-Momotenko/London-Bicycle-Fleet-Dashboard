from flask import make_response, jsonify, request
from flask.views import MethodView

from app.models import db


class NearestToPointAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    def get(self):
        lat = float(request.args.get('latitude'))
        lon = float(request.args.get('longitude'))

        raw_query = """
            select name, latitude, longitude,  sqrt(
                pow(111.139 * (bicycle_station.latitude - {lat}), 2) +
                pow(111.139 * ({lon} - bicycle_station.longitude) * COS(latitude / 57.3), 2)
                ) as distance
            from bicycle_station
            order by distance
            limit 15;
         """

        return make_response(
            jsonify(
                [
                    {
                        'name': i[0],
                        'lat': round(i[1], 6),
                        'lon': round(i[2], 6),
                        'distance': round(i[3], 2)
                    } for i in db.engine.execute(raw_query.format(lat=lat, lon=lon))
                ]
            )
        )


class AverageDistanceBetweenStationsAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    def get(self):
        raw_query = """
            select round(avg(sqrt(
                pow(111.139 * (start_station.latitude - end_station.latitude), 2) +
                pow(
                    111.139 * (end_station.longitude - start_station.longitude) * COS(start_station.latitude / 57.3),
                    2
                ))), 6) as average
            from bicycle_hire
            join bicycle_station as start_station on (start_station.id = bicycle_hire.start_station_id)
            join bicycle_station as end_station on (end_station.id = bicycle_hire.end_station_id);
         """

        return make_response(
            jsonify(
                [i[0] for i in db.engine.execute(raw_query)][0]
            )
        )
