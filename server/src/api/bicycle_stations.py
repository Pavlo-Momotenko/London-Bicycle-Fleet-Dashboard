from datetime import date
from functools import partial
from types import NoneType

from flask import request, send_file
from pandas import read_sql_query
from sqlalchemy.exc import IntegrityError

from src.models.db_obj import db
from src.api.base import BaseAPI
from src.constants import FileDataType, DATE_FORMAT, ROWS_PER_PAGE
from src.http.error import HttpErrorResponse
from src.http.response import HttpResponse
from src.models.location import Location
from src.models.station import Station
from src.models.uploaded_file_stats import UploadedFileStats
from src.utils.error_list import ErrorList
from src.utils.file import FileUtils, file_attached_required
from src.utils.data import DataUtils


class BicycleStationsAPI(BaseAPI):
    methods = ["GET", "POST", "DELETE"]
    IMPORT_DATA_VALIDATIONS: dict[str, dict[str, callable]] = {
        "id": {
            "validator": partial(
                DataUtils.validate_numeric,
                data_type=int,
                min_value=1,
                allowed_signed=False,
                allowed_nullable=False,
            )
        },
        "latitude": {
            "validator": partial(
                DataUtils.validate_data_by_types,
                data_type=float,
                allowed_nullable=False,
            ),
        },
        "longitude": {
            "validator": partial(
                DataUtils.validate_data_by_types,
                data_type=float,
                allowed_nullable=False,
            ),
        },
        "name": {
            "validator": partial(
                DataUtils.validate_data_by_types, data_type=str, allowed_nullable=False
            )
        },
        "terminal_name": {
            "converter": partial(DataUtils.convert_to_type, convert_type=str),
            "validator": partial(
                DataUtils.validate_data_by_types, data_type=str, allowed_nullable=False
            ),
        },
        "installed": {
            "validator": partial(DataUtils.validate_data_by_types, data_type=bool)
        },
        "locked": {
            "validator": partial(DataUtils.validate_data_by_types, data_type=bool)
        },
        "temporary": {
            "validator": partial(DataUtils.validate_data_by_types, data_type=bool)
        },
        "bikes_count": {
            "validator": partial(
                DataUtils.validate_numeric, data_type=int, allowed_signed=False
            )
        },
        "docks_count": {
            "validator": partial(
                DataUtils.validate_numeric, data_type=int, allowed_signed=False
            )
        },
        "install_date": {
            "converter": DataUtils.convert_to_date,
            "validator": partial(
                DataUtils.validate_data_by_types, data_type=(date, NoneType)
            ),
        },
        "removal_date": {
            "converter": DataUtils.convert_to_date,
            "validator": partial(
                DataUtils.validate_data_by_types, data_type=(date, NoneType)
            ),
        },
    }

    def get(self):
        page = int(request.args.get("page", 1))

        if not DataUtils.validate_numeric(
            page, min_value=1, allowed_signed=False, allowed_nullable=False
        ):
            return HttpErrorResponse("'page' query parameter value is invalid")

        data = Station.query.order_by(Station.id).paginate(
            page=page, per_page=ROWS_PER_PAGE
        )

        if data is None or not data.items:
            return HttpErrorResponse("There is no data to display")

        return HttpResponse(
            {
                "items": [
                    {
                        "id": i.id,
                        "name": i.name,
                        "install_date": i.install_date.strftime(DATE_FORMAT)
                        if i.install_date
                        else None,
                        "installed": i.installed,
                        "locked": i.locked,
                        "bikes_count": i.bikes_count,
                        "docks_count": i.docks_count,
                        "empty_docks_count": i.empty_docks_count,
                        "removal_date": i.removal_date.strftime(DATE_FORMAT)
                        if i.removal_date
                        else None,
                        "temporary": i.temporary,
                        "location_id": i.location_id,
                    }
                    for i in data.items
                ],
                "headers": [
                    "id",
                    "name",
                    "install_date",
                    "installed",
                    "locked",
                    "bikes_count",
                    "docks_count",
                    "empty_docks_count",
                    "removal_date",
                    "temporary",
                    "location_id",
                ],
                "has_next": data.has_next,
                "has_prev": data.has_prev,
                "page": data.page,
            }
        )

    @file_attached_required
    def post(self):
        uploaded_file = request.files["file"]

        uploaded_file_dataframe = FileUtils.file_to_dataframe(uploaded_file)
        if uploaded_file_dataframe is None:
            return HttpErrorResponse(
                "Uploaded file has wrong format or wrong file extension"
            )

        errors = ErrorList()
        processed_stations_count: int = 0
        for index, row in uploaded_file_dataframe.iterrows():
            for item, config in self.IMPORT_DATA_VALIDATIONS.items():
                converter_func = config.get("converter")
                validate_func = config["validator"]
                row[item] = converter_func(row[item]) if converter_func else row[item]
                if not validate_func(row[item]):
                    errors.add_error(f"Row #{index + 1}: Invalid {item}")
                    break
            else:
                location_obj = Location.find(name=row["name"])
                if not location_obj:
                    location_obj = Location.create(
                        name=row["name"],
                        latitude=row["latitude"],
                        longitude=row["longitude"],
                    )

                station_obj = Station.find(id=row["id"])
                station_kwargs = dict(
                    id=row["id"],
                    name=row["terminal_name"],
                    install_date=row["install_date"],
                    installed=row["installed"],
                    locked=row["locked"],
                    bikes_count=row["bikes_count"],
                    docks_count=row["docks_count"],
                    removal_date=row["removal_date"],
                    temporary=row["temporary"],
                    location_id=location_obj.id,
                )
                if station_obj:
                    station_obj.update(**station_kwargs)
                else:
                    Station.create(**station_kwargs)

                processed_stations_count += 1

        UploadedFileStats.create(
            name=uploaded_file.filename,
            rows_count=processed_stations_count,
            file_data_type=FileDataType.BICYCLE_STATIONS.value,
        )
        return HttpResponse(
            {"message": "File was uploaded successfully", "errors": errors.to_list()}
        )

    def delete(self):
        try:
            Station.delete_all()
        except IntegrityError:
            return HttpErrorResponse(
                "Stations are in use, delete bicycle rentals first"
            )

        UploadedFileStats.query.filter_by(
            file_data_type=FileDataType.BICYCLE_STATIONS.value
        ).delete()
        db.session.commit()

        return HttpResponse({"message": "Stations were deleted successfully"})


class BicycleStationsLogsAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        files = UploadedFileStats.query.filter_by(
            file_data_type=FileDataType.BICYCLE_STATIONS.value
        ).all()

        return HttpResponse(
            [
                {
                    "id": file_stat_obj.id,
                    "name": file_stat_obj.name,
                    "uploadedAt": file_stat_obj.uploaded_at.strftime(DATE_FORMAT),
                    "rowsCount": file_stat_obj.rows_count,
                }
                for file_stat_obj in files
            ]
        )


class BicycleStationsExportAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        as_type = request.args.get("as")  # csv/xlsx

        query = """
            SELECT
                station.id,
                station.install_date,
                IF(station.installed, 'TRUE', 'FALSE') AS 'installed',
                location.latitude,
                IF(station.locked, 'TRUE', 'FALSE') AS 'locked',
                location.longitude,
                location.name AS 'name',
                station.bikes_count,
                station.docks_count,
                station.docks_count - station.bikes_count AS 'nbEmptyDocks',
                station.removal_date,
                IF(station.temporary, 'TRUE', 'FALSE') AS 'temporary',
                station.name AS 'terminal_name'
            FROM station
            JOIN location ON station.location_id = location.id;
        """

        df = read_sql_query(query, db.session.connection().engine)
        file = FileUtils.dataframe_to_file(df, as_type)

        if not file:
            return HttpErrorResponse(f"File cannot be created with '{as_type}'")

        return send_file(file, as_attachment=True, download_name=f"export.{as_type}")
