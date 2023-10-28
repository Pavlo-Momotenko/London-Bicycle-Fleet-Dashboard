from src.models.base import Base
from src.models.db_obj import db
from src.models.location import Location


class Station(Base):
    __tablename__ = "station"

    name = db.Column(db.String(128), nullable=False)
    install_date = db.Column(db.Date)
    installed = db.Column(db.Boolean, nullable=False, default=False)
    locked = db.Column(db.Boolean, nullable=False, default=False)
    bikes_count = db.Column(db.Integer, nullable=False, default=0)
    docks_count = db.Column(db.Integer, nullable=False, default=0)
    removal_date = db.Column(db.Date)
    temporary = db.Column(db.Boolean, nullable=False, default=False)
    location_id = db.Column(db.Integer, db.ForeignKey(Location.id), nullable=False)

    @property
    def empty_docks_count(self) -> int:
        return self.docks_count - self.bikes_count
