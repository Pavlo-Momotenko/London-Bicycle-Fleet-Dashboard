from http import HTTPStatus
from flask import request, make_response, jsonify
from flask.views import MethodView

from app.data_servicing.data_verification import verify_file_data_type, ALLOWED_DATA_INPUT_TYPES
from app.models import FileDataType, UploadFileLog, BicycleStation, BicycleHire, db

PAGINATION_ROWS_PER_PAGE = 10
DAYS_OF_WEEK = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday"
}


class DataPaginationAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    @verify_file_data_type
    def get(self, data_input_type: str, page: int):
        page = page or 1
        headers = tuple(ALLOWED_DATA_INPUT_TYPES.get(data_input_type).keys())
        data_input_type = UploadFileLog.resolve(data_input_type)

        data = None
        if data_input_type == FileDataType.BICYCLE_STATIONS.value:
            data = BicycleStation.query.order_by(BicycleStation.id).paginate(page=page,
                                                                             per_page=PAGINATION_ROWS_PER_PAGE)
        elif data_input_type == FileDataType.BICYCLE_HIRES.value:
            data = BicycleHire.query.order_by(BicycleHire.rental_id).paginate(page=page,
                                                                              per_page=PAGINATION_ROWS_PER_PAGE)

        if data is None or not data.items:
            return make_response(jsonify({'errors': ['There is no data to show']}), HTTPStatus.BAD_REQUEST)

        return make_response(jsonify({
            "items": [i.to_json() for i in data.items],
            "headers": headers,
            "has_next": data.has_next,
            "has_prev": data.has_prev,
            "page": data.page,
        }))


class TopPopularAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    def get(self):
        ordering = request.args.get('ordering', 'asc')

        if ordering not in ('asc', 'desc'):
            return make_response(
                jsonify(
                    {'errors': [f"'{ordering}' is not valid for ordering"]}
                ), HTTPStatus.BAD_REQUEST
            )

        raw_query = """
            select end_station_id, end_station_name, sum(used_times) as used_times_sum from (
                select count(*) as used_times, end_station_id, end_station_name from bicycle_hire
                where weekday(end_date) = {day_of_week}
                group by weekday(end_date), end_station_id, end_station_name
                union
                select count(*) as used_times, start_station_id, start_station_name from bicycle_hire
                where weekday(start_date) = {day_of_week}
                group by weekday(start_date), start_station_id, start_station_name
            ) as start_end_usage
            GROUP BY end_station_id, end_station_name
            ORDER BY used_times_sum {ordering}
            limit 10;
        """

        result = {
            "week_days": [day_name for day_name in DAYS_OF_WEEK.values()],
            "week_days_data": [
                [
                    {
                        'id': i[0],
                        'station_name': i[1],
                        'times_used': i[2]
                    }
                    for i in db.engine.execute(raw_query.format(day_of_week=day_sql, ordering=ordering))
                ]
                for day_sql in DAYS_OF_WEEK.keys()
            ]
        }
        result["is_any_data"] = any(result['week_days_data'])
        return make_response(jsonify(result))


class BikeDistributionChartAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    def get(self):
        raw_query = """
            SELECT duration, count(*) as d_count
            FROM bicycle_hire
            GROUP BY duration
            ORDER BY d_count desc
            LIMIT 50;
         """

        return make_response(jsonify([tuple(i) for i in db.engine.execute(raw_query)]))


class MostTurnoverRateStationChartAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    def get(self):
        raw_query = """
            select name, longitude, latitude from bicycle_station
            join
            (select end_station_id as station_id, sum(used_times) as max_used_times
            from (select count(*) as used_times, end_station_id
                  from bicycle_hire
                  group by end_station_id, end_station_name
                  union
                  select count(*) as used_times, start_station_id
                  from bicycle_hire
                  group by weekday(start_date), start_station_id) as start_end_usage
            GROUP BY end_station_id
            ORDER BY max_used_times desc
            limit 10) as max_turnover_station
            on (id = station_id);
         """
        return make_response(
            jsonify(
                [
                    {
                        'name': i[0],
                        'lat': round(i[2], 6),
                        'lon': round(i[1], 6)
                    } for i in db.engine.execute(raw_query)
                ]
            )
        )


class StationsMapChartAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    def get(self):
        raw_query = """
            select name, longitude, latitude from bicycle_station
            limit 50;
         """
        return make_response(
            jsonify(
                [
                    {
                        'name': i[0],
                        'lat': round(i[2], 6),
                        'lon': round(i[1], 6)
                    } for i in db.engine.execute(raw_query)
                ]
            )
        )
