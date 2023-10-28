from flask import request
from sqlalchemy import func

from src.models.db_obj import db
from src.api.base import BaseAPI
from src.constants import Weekday
from src.http.error import HttpErrorResponse
from src.http.response import HttpResponse
from src.models.rental import Rental
from src.services.station_service import StationService


class WeekdayStationsPopularityAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        ordering = request.args.get("ordering", "asc")

        if ordering not in ("asc", "desc"):
            return HttpErrorResponse(f"'{ordering}' is not valid for ordering")

        data = {
            "weekDays": [day.title for day in Weekday],
            "weekDaysData": [
                [
                    {
                        "id": weekday_station_data.id,
                        "stationName": weekday_station_data.name,
                        "numberOfRentals": weekday_station_data.num_of_rentals,
                    }
                    for weekday_station_data in StationService.get_weekday_stations_popularity(
                        weekday=day.index, ascending=ordering == "asc"
                    )
                ]
                for day in Weekday
            ],
        }
        data["isAnyData"] = any(data["weekDaysData"])
        return HttpResponse(data)


class RentalDurationDistributionAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        durations = (
            db.session.query(
                Rental.duration, func.count(Rental.duration).label("count")
            )
            .group_by(Rental.duration)
            .limit(50)
            .all()
        )
        durations = [(value.duration, value.count) for value in durations]
        return HttpResponse(durations)


class StationsTurnoverRateMapAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        turnover_rates = StationService.get_stations_turnover_rate()
        data = [
            {
                "stationId": value.id,
                "locationName": value.location_name,
                "locationLatitude": value.latitude,
                "locationLongitude": value.longitude,
                "totalTurnover": value.turnover,
            }
            for value in turnover_rates
        ]
        return HttpResponse(data)


class StationsMapAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        stations_map = StationService.get_stations_map_data()
        data = [
            {
                "stationId": value.id,
                "locationName": value.location_name,
                "locationLatitude": value.latitude,
                "locationLongitude": value.longitude,
            }
            for value in stations_map
        ]
        return HttpResponse(data)
