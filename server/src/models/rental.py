from src.models.base import Base
from src.models.bike import Bike
from src.models.db_obj import db
from src.models.station import Station


class Rental(Base):
    __table_name__ = "rental"

    duration = db.Column(db.Integer, nullable=False, default=0)
    bike_id = db.Column(db.Integer, db.ForeignKey(Bike.id), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    start_station_id = db.Column(db.Integer, db.ForeignKey(Station.id), nullable=False)
    end_date = db.Column(db.DateTime)
    end_station_id = db.Column(db.Integer)
