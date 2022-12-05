import enum
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

TYPES_MAP = {
    'bicycle_station': {
        'id': db.Integer,
        'install_date': db.Date,
        'installed': db.Boolean,
        'latitude': db.Float,
        'locked': db.Boolean,
        'longitude': db.Float,
        'name': db.String(128),
        'bikes_count': db.Integer,
        'docks_count': db.Integer,
        'nbEmptyDocks': db.Integer,
        'removal_date': db.Date,
        'temporary': db.Boolean,
        'terminal_name': db.Integer
    },
    'bicycle_hire': {
        'rental_id': db.Integer,
        'duration': db.Integer,
        'bike_id': db.Integer,
        'end_date': db.DateTime(timezone=True),
        'end_station_id': db.Integer,
        'end_station_name': db.String(128),
        'start_date': db.DateTime(timezone=True),
        'start_station_id': db.Integer,
        'start_station_name': db.String(128)
    }
}


class BicycleStation(db.Model):
    __tablename__ = 'bicycle_station'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    install_date = db.Column(db.Date)
    installed = db.Column(db.Boolean)
    locked = db.Column(db.Boolean)
    bikes_count = db.Column(db.Integer)
    docks_count = db.Column(db.Integer)
    nbEmptyDocks = db.Column(db.Integer)
    removal_date = db.Column(db.Date)
    temporary = db.Column(db.Boolean)
    terminal_name = db.Column(db.Integer)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'install_date': self.install_date,
            'installed': self.installed,
            'locked': self.locked,
            'bikes_count': self.bikes_count,
            'docks_count': self.docks_count,
            'nbEmptyDocks': self.nbEmptyDocks,
            'removal_date': self.removal_date,
            'temporary': self.temporary,
            'terminal_name': self.terminal_name,
            'latitude': self.latitude,
            'longitude': self.longitude
        }


class BicycleHire(db.Model):
    __table_name__ = 'bicycle_hire'
    rental_id = db.Column(db.Integer, primary_key=True)
    duration = db.Column(db.Integer)
    bike_id = db.Column(db.Integer)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    end_station_id = db.Column(db.Integer)
    end_station_name = db.Column(db.String(128))
    start_station_id = db.Column(db.Integer)
    start_station_name = db.Column(db.String(128))

    def to_json(self):
        return {
            'rental_id': self.rental_id,
            'duration': self.duration,
            'bike_id': self.bike_id,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'end_station_id': self.end_station_id,
            'end_station_name': self.end_station_name,
            'start_station_id': self.start_station_id,
            'start_station_name': self.start_station_name
        }


# FILE LOG
class FileDataType(enum.Enum):
    NONE = 0
    BICYCLE_STATIONS = 1
    BICYCLE_HIRES = 2


class UploadFileLog(db.Model):
    __tablename__ = 'upload_file_log'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    rows_count = db.Column(db.Integer, nullable=False)
    file_data_type = db.Column(db.Integer, default=FileDataType.NONE.value, nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'uploaded_at': self.uploaded_at,
            'rows_count': self.rows_count
        }

    @staticmethod
    def resolve(file_data_type: str):
        if file_data_type == 'bicycle_station':
            file_data_type = FileDataType.BICYCLE_STATIONS.value
        elif file_data_type == 'bicycle_hire':
            file_data_type = FileDataType.BICYCLE_HIRES.value
        else:
            file_data_type = FileDataType.NONE.value
        return file_data_type
