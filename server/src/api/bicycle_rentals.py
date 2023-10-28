from datetime import date
from functools import partial
from types import NoneType

from flask import request, send_file
from pandas import read_sql_query

from src.models.db_obj import db
from src.api.base import BaseAPI
from src.constants import FileDataType, DATE_FORMAT, ROWS_PER_PAGE
from src.http.error import HttpErrorResponse
from src.http.response import HttpResponse
from src.models.bike import Bike
from src.models.rental import Rental
from src.models.station import Station
from src.models.uploaded_file_stats import UploadedFileStats
from src.utils.error_list import ErrorList
from src.utils.file import FileUtils, file_attached_required
from src.utils.data import DataUtils


class BicycleRentalsAPI(BaseAPI):
    methods = ["GET", "POST", "DELETE"]
    IMPORT_DATA_VALIDATIONS: dict[str, dict[str, callable]] = {
        "rental_id": {
            "converter": partial(DataUtils.convert_to_type, convert_type=int),
            "validator": partial(
                DataUtils.validate_numeric,
                data_type=int,
                min_value=1,
                allowed_signed=False,
                allowed_nullable=False,
            ),
        },
        "duration": {
            "converter": partial(DataUtils.convert_to_type, convert_type=int),
            "validator": partial(
                DataUtils.validate_numeric, data_type=int, allowed_signed=False
            ),
        },
        "bike_id": {
            "converter": partial(DataUtils.convert_to_type, convert_type=int),
            "validator": partial(
                DataUtils.validate_numeric,
                data_type=int,
                min_value=1,
                allowed_signed=False,
                allowed_nullable=False,
            ),
        },
        "end_date": {
            "converter": DataUtils.convert_to_datetime,
            "validator": partial(
                DataUtils.validate_data_by_types, data_type=(date, NoneType)
            ),
        },
        "end_station_id": {
            "converter": partial(DataUtils.convert_to_type, convert_type=int),
            "validator": partial(
                DataUtils.validate_numeric,
                data_type=int,
                min_value=1,
                allowed_signed=False,
                allowed_nullable=False,
            ),
        },
        "start_date": {
            "converter": DataUtils.convert_to_datetime,
            "validator": partial(DataUtils.validate_data_by_types, data_type=date),
        },
        "start_station_id": {
            "converter": partial(DataUtils.convert_to_type, convert_type=int),
            "validator": partial(
                DataUtils.validate_numeric,
                data_type=int,
                min_value=1,
                allowed_signed=False,
                allowed_nullable=False,
            ),
        },
    }

    def get(self):
        page = int(request.args.get("page", 1))

        if not DataUtils.validate_numeric(
            page, min_value=1, allowed_signed=False, allowed_nullable=False
        ):
            return HttpErrorResponse("'page' query parameter value is invalid")

        data = Rental.query.order_by(Rental.id).paginate(
            page=page, per_page=ROWS_PER_PAGE
        )

        if data is None or not data.items:
            return HttpErrorResponse("There is no data to display")

        return HttpResponse(
            {
                "items": [
                    {
                        "id": i.id,
                        "bike_id": i.bike_id,
                        "duration": i.duration,
                        "start_station_id": i.start_station_id,
                        "start_date": i.start_date.strftime(DATE_FORMAT),
                        "end_station_id": i.end_station_id,
                        "end_date": i.end_date.strftime(DATE_FORMAT)
                        if i.end_date
                        else None,
                    }
                    for i in data.items
                ],
                "headers": [
                    "id",
                    "bike_id",
                    "duration",
                    "start_station_id",
                    "start_date",
                    "end_station_id",
                    "end_date",
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
        processed_hires_count: int = 0
        for index, row in uploaded_file_dataframe.iterrows():
            for item, config in self.IMPORT_DATA_VALIDATIONS.items():
                converter_func = config.get("converter")
                validate_func = config["validator"]
                row[item] = converter_func(row[item]) if converter_func else row[item]
                if not validate_func(row[item]):
                    errors.add_error(f"Row #{index + 1}: Invalid {item}")
                    break
            else:
                bike_obj = Bike.find_or_create(id=row["bike_id"])
                start_station_obj = Station.find(id=row["start_station_id"])
                if not start_station_obj:
                    errors.add_error(
                        f"Start station with ID: {row['start_station_id']} does not exist"
                    )
                    continue

                end_station_obj = Station.find(id=row["end_station_id"])
                rental_obj = Rental.find(id=row["rental_id"])
                rental_kwargs = dict(
                    id=row["rental_id"],
                    duration=row["duration"],
                    bike_id=bike_obj.id,
                    start_date=row["start_date"],
                    end_date=row["end_date"],
                    start_station_id=start_station_obj.id,
                    end_station_id=end_station_obj.id if end_station_obj else None,
                )
                if rental_obj:
                    rental_obj.update(**rental_kwargs)
                else:
                    Rental.create(**rental_kwargs)

                processed_hires_count += 1

        UploadedFileStats.create(
            name=uploaded_file.filename,
            rows_count=processed_hires_count,
            file_data_type=FileDataType.BICYCLE_RENTALS.value,
        )
        return HttpResponse(
            {"message": "File was uploaded successfully", "errors": errors.to_list()}
        )

    def delete(self):
        Rental.delete_all()

        UploadedFileStats.query.filter_by(
            file_data_type=FileDataType.BICYCLE_RENTALS.value
        ).delete()
        db.session.commit()

        return HttpResponse({"message": "Rentals were deleted successfully"})


class BicycleRentalsLogsAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        files = UploadedFileStats.query.filter_by(
            file_data_type=FileDataType.BICYCLE_RENTALS.value
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


class BicycleRentalsExportAPI(BaseAPI):
    methods = ["GET"]

    def get(self):
        as_type = request.args.get("as")  # csv/xlsx

        query = """
            SELECT
                rental.id AS 'rental_id',
                rental.duration,
                rental.bike_id,
                rental.end_date,
                rental.end_station_id,
                end_station.name AS 'end_station_name',
                rental.start_date,
                rental.start_station_id,
                start_station.name AS 'start_station_name'
            FROM rental
            JOIN station AS start_station ON rental.start_station_id = start_station.id
            JOIN station AS end_station ON rental.end_station_id = end_station.id;
        """

        df = read_sql_query(query, db.session.connection().engine)
        file = FileUtils.dataframe_to_file(df, as_type)

        if not file:
            return HttpErrorResponse(f"File cannot be created with '{as_type}'")

        return send_file(file, as_attachment=True, download_name=f"export.{as_type}")
