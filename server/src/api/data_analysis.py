from flask import request

from src.api.base import BaseAPI
from src.http.response import HttpResponse
from src.services.location_service import LocationService


class NearestStationsToLocationAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        latitude = float(request.args.get("latitude"))
        longitude = float(request.args.get("longitude"))

        nearest_stations = LocationService.get_nearest_stations_to_location(
            latitude=latitude, longitude=longitude
        )
        data = [
            {
                "stationId": value.id,
                "latitude": value.latitude,
                "longitude": value.longitude,
                "locationName": value.name,
                "distance": value.distance_in_meters,
            }
            for value in nearest_stations
        ]
        return HttpResponse(data)


class AverageDistanceBetweenStationsAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        return HttpResponse(LocationService.get_average_distance())
