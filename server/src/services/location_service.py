from typing import Any

from sqlalchemy import func
from sqlalchemy.orm import aliased
from sqlalchemy.sql.elements import BinaryExpression

from src.models.db_obj import db
from src.constants import EARTH_RADIUS
from src.models.location import Location
from src.models.station import Station


class LocationService:
    @staticmethod
    def haversine(input_longitude: float, input_latitude: float) -> BinaryExpression:
        lon_input_rad = func.radians(input_longitude)
        lat_input_rad = func.radians(input_latitude)
        lon_rad = func.radians(Location.longitude)
        lat_rad = func.radians(Location.latitude)

        a = func.pow(func.sin((lat_rad - lat_input_rad) / 2), 2) + func.cos(
            lat_input_rad
        ) * func.cos(lat_rad) * func.pow(func.sin((lon_rad - lon_input_rad) / 2), 2)
        c = 2 * func.atan2(func.sqrt(a), func.sqrt(1 - a))
        d = EARTH_RADIUS * c
        return func.round(d, 2)

    @staticmethod
    def get_nearest_stations_to_location(
        longitude: float, latitude: float
    ) -> list[Any]:
        return (
            db.session.query(
                Station.id,
                Location.latitude,
                Location.longitude,
                Location.name,
                LocationService.haversine(longitude, latitude).label(
                    "distance_in_meters"
                ),
            )
            .join(Location, Station.location_id == Location.id)
            .order_by("distance_in_meters")
            .limit(15)
            .all()
        )

    @staticmethod
    def get_average_distance() -> int:
        station_aliased = aliased(Station)
        location_aliased = aliased(Location)

        subquery = (
            db.session.query(
                LocationService.haversine(
                    location_aliased.longitude, location_aliased.latitude
                ).label("distance"),
                Station.id,
                station_aliased.id,
            )
            .join(Location, Station.location_id == Location.id)
            .join(station_aliased, Station.id != station_aliased.id)
            .join(location_aliased, station_aliased.location_id == location_aliased.id)
            .subquery()
        )

        average_distance = db.session.query(
            func.round(func.avg(subquery.c.distance), 2).label(
                "average_distance"
            )  # Select distinct distances
        ).first()
        return average_distance.average_distance if average_distance else 0
