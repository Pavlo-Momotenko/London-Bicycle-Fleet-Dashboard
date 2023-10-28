from src.models.base import Base
from src.models.db_obj import db


class Location(Base):
    __table_name__ = "location"

    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    name = db.Column(db.String(128), unique=True, nullable=False)
