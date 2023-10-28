from typing import Any

from sqlalchemy import func, desc, asc, union_all, select

from src.models.db_obj import db
from src.models.location import Location
from src.models.rental import Rental
from src.models.station import Station


class StationService:
    @staticmethod
    def get_weekday_stations_popularity(
            weekday: int, limit: int = 10, ascending: bool = True
    ) -> list[Any]:
        order_func = asc if ascending else desc
        return (
            db.session.query(
                Station.id, Station.name, func.count(Rental.id).label("num_of_rentals")
            )
            .join(Station, Rental.start_station_id == Station.id)
            .filter(func.weekday(Rental.start_date) == weekday)
            .group_by(Station.id, Station.name)
            .order_by(order_func("num_of_rentals"))
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_stations_turnover_rate() -> list[Any]:
        subquery = union_all(
            select([Rental.start_station_id.label("station_id")]),
            select([Rental.end_station_id.label("station_id")])
        )

        return (
            db.session.query(
                Station.id,
                Location.latitude,
                Location.longitude,
                Location.name.label("location_name"),
                func.count().label("turnover")
            )
            .join(subquery, Station.id == subquery.c.station_id)
            .join(Location, Station.location_id == Location.id)
            .group_by(Station.id, Location.name, Location.latitude, Location.longitude)
            .order_by(desc("turnover"))
            .limit(50)
            .all()
        )

    @staticmethod
    def get_stations_map_data() -> list[Any]:
        return (
            db.session.query(
                Station.id,
                Location.latitude,
                Location.longitude,
                Location.name.label("location_name"),
            )
            .join(Location, Station.location_id == Location.id)
            .limit(200)
            .all()
        )
