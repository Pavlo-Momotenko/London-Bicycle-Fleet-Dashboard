import io
from datetime import datetime
from typing import Optional
import pandas as pd
from flask import request, make_response, jsonify
from flask.views import MethodView
from http import HTTPStatus

from pandas.errors import ParserError

from app.data_servicing.data_verification import file_and_extension_verification, check_data_type, \
    verify_file_data_type, remove_time_zones
from app.models import db, UploadFileLog, BicycleHire, FileDataType, BicycleStation, TYPES_MAP


class UploadDataAPI(MethodView):
    init_every_request = False
    methods = ["GET", "POST", "DELETE"]

    @staticmethod
    def log_successfully_loaded_file(file_name: str, uploaded_at: Optional[datetime.date], rows_count: int,
                                     file_data_type: str) -> None:

        file_log = UploadFileLog(
            name=file_name,
            uploaded_at=uploaded_at or datetime.now(),
            rows_count=rows_count,
            file_data_type=UploadFileLog.resolve(file_data_type)
        )
        db.session.add(file_log)
        db.session.commit()

    @staticmethod
    def read_csv(content) -> Optional[pd.DataFrame]:
        try:
            df = pd.read_csv(content, header=0, skipinitialspace=True)
        except ParserError:
            df = None
        return df

    @staticmethod
    def read_read_excel(content) -> Optional[pd.DataFrame]:
        try:
            df = pd.read_excel(content, header=0)
        except ParserError:
            df = None
        return df

    @file_and_extension_verification
    @verify_file_data_type
    def post(self, data_input_type: str):
        file_obj = request.files['file']
        if file_obj.filename.endswith('csv'):
            df = self.read_csv(file_obj)
        else:
            df = pd.read_excel(file_obj)

        if df is None:
            return make_response(jsonify({'errors': ['File cannot be parsed']}), HTTPStatus.BAD_REQUEST)

        try:
            df = check_data_type(df, data_input_type)
        except KeyError:
            return make_response(jsonify({'errors': ['File format is invalid']}), HTTPStatus.BAD_REQUEST)

        df.drop_duplicates(keep='last', inplace=True)

        rows_count = df.to_sql(
            con=db.session.connection().engine,
            name=data_input_type,
            if_exists='replace',
            index=False,
            dtype=TYPES_MAP[data_input_type]
        )

        self.log_successfully_loaded_file(
            file_name=file_obj.filename,
            rows_count=rows_count,
            file_data_type=data_input_type,
            uploaded_at=None
        )

        return make_response(jsonify({'success': "File was uploaded successfully"}))

    @verify_file_data_type
    def get(self, data_input_type: str):
        files = UploadFileLog.query.filter_by(file_data_type=UploadFileLog.resolve(data_input_type)).all()
        if files:
            return make_response(jsonify({'files': [i.to_json() for i in files]}))
        return make_response({})

    @verify_file_data_type
    def delete(self, data_input_type: str):
        data_input_type = UploadFileLog.resolve(data_input_type)
        data = None
        if data_input_type == FileDataType.BICYCLE_STATIONS.value:
            data = BicycleStation.query.delete()
        elif data_input_type == FileDataType.BICYCLE_HIRES.value:
            data = BicycleHire.query.delete()

        if data is None:
            return make_response(jsonify({'errors': ['There is no data to remove']}), HTTPStatus.BAD_REQUEST)

        db.session.commit()
        UploadFileLog.query.filter_by(file_data_type=data_input_type).delete()
        db.session.commit()
        return make_response(jsonify({'success': f"Data was removed"}))


class DownloadCSVAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    @verify_file_data_type
    def get(self, data_input_type: str):
        df = pd.read_sql_table(
            data_input_type,
            db.session.connection().engine
        )
        df = check_data_type(df, data_input_type)
        resp = make_response(df.to_csv(columns=TYPES_MAP[data_input_type].keys(), index=False))
        resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
        resp.headers["Content-Type"] = "text/csv"
        return resp


class DownloadExcelAPI(MethodView):
    init_every_request = False
    methods = ["GET"]

    @verify_file_data_type
    def get(self, data_input_type: str):
        df = pd.read_sql_table(
            data_input_type,
            db.session.connection().engine
        )
        df = check_data_type(df, data_input_type)
        df = remove_time_zones(df, data_input_type)

        out = io.BytesIO()
        writer = pd.ExcelWriter(out, engine='xlsxwriter')
        df.to_excel(
            columns=TYPES_MAP[data_input_type].keys(), index=False, excel_writer=writer,
            sheet_name='Sheet'
        )
        resp = make_response(out.getvalue())
        resp.headers["Content-Disposition"] = "attachment; filename=export.xlsx"
        resp.headers["Content-Type"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        return resp
