import enum
from functools import wraps
from http import HTTPStatus

import numpy as np
import pandas as pd
from flask import request, make_response, jsonify
from pandas import DataFrame


class DataType(enum.Enum):
    INT = 'integer'
    DATETIME = 'datetime64'
    BOOL = 'bool'
    FLOAT = 'float'
    STRING = 'object'
    DATE = 'date'

    def __eq__(self, other) -> bool:
        return self.value == other.value


ALLOWED_FILE_EXTENSIONS = ('csv', 'xlsx')

ALLOWED_DATA_INPUT_TYPES = {
    'bicycle_station': {
        'id': DataType.INT,
        'install_date': DataType.DATE,
        'installed': DataType.BOOL,
        'latitude': DataType.FLOAT,
        'locked': DataType.BOOL,
        'longitude': DataType.FLOAT,
        'name': DataType.STRING,
        'bikes_count': DataType.INT,
        'docks_count': DataType.INT,
        'nbEmptyDocks': DataType.INT,
        'removal_date': DataType.DATE,
        'temporary': DataType.BOOL,
        'terminal_name': DataType.INT
    },
    'bicycle_hire': {
        'rental_id': DataType.INT,
        'duration': DataType.INT,
        'bike_id': DataType.INT,
        'end_date': DataType.DATETIME,
        'end_station_id': DataType.INT,
        'end_station_name': DataType.STRING,
        'start_date': DataType.DATETIME,
        'start_station_id': DataType.INT,
        'start_station_name': DataType.STRING
    }
}


def is_filename_allowed(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_FILE_EXTENSIONS


def verify_file_data_type(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        # Request parameter was not found
        if not (args or args[1] or args[1] in ALLOWED_DATA_INPUT_TYPES):
            return make_response(jsonify({'errors': ['"data_input_type" parameter was not found in request']}),
                                 HTTPStatus.BAD_REQUEST)
        return function(*args, **kwargs)

    return decorated_function


def file_and_extension_verification(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        # File was not uploaded
        if 'file' not in request.files:
            return make_response(jsonify({'errors': ['File was NOT uploaded']}), HTTPStatus.BAD_REQUEST)

        file_obj = request.files['file']

        # File was not selected
        if not file_obj or file_obj.filename == '':
            return make_response(jsonify({'errors': ['File was NOT selected']}), HTTPStatus.BAD_REQUEST)

        # File with not allowed extension
        if not is_filename_allowed(filename=file_obj.filename):
            return make_response(jsonify({'errors': ['File extension is NOT allowed']}), HTTPStatus.BAD_REQUEST)
        return function(*args, **kwargs)

    return decorated_function


def check_data_type(df: DataFrame, data_input_type: str) -> DataFrame:
    for field, data_type in ALLOWED_DATA_INPUT_TYPES.get(data_input_type, {}).items():
        if data_type == DataType.BOOL or data_type == DataType.STRING:
            df[field] = df[field].astype(data_type.value, errors='ignore')
        elif data_type == DataType.DATETIME:
            df[field] = pd.to_datetime(df[field], errors='coerce', utc=True)
        elif data_type == DataType.DATE:
            df[field] = pd.to_datetime(df[field], errors='coerce', utc=True).dt.date
        elif data_type == DataType.INT or data_type == DataType.FLOAT:
            df[field] = pd.to_numeric(df[field], downcast=data_type.value, errors='coerce')

            df[field] = df[field].fillna(0)
            df[field] = df[field].replace([np.inf, -np.inf, np.nan], 0)

            if data_type == DataType.INT:
                df[field] = df[field].astype(int)

    return df


def remove_time_zones(df: DataFrame, data_input_type: str) -> DataFrame:
    for field, data_type in ALLOWED_DATA_INPUT_TYPES.get(data_input_type, {}).items():
        if data_type == DataType.DATETIME:
            df[field] = df[field].dt.tz_localize(None)
    return df
