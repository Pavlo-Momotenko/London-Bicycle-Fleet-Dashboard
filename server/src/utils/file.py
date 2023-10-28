from functools import wraps
from io import BytesIO
from typing import Optional

from flask import request
from pandas import DataFrame, read_csv, read_excel
from pandas.errors import ParserError
from werkzeug.datastructures import FileStorage

from src.constants import ALLOWED_FILE_EXTENSIONS
from src.http.error import HttpErrorResponse
from src.http.response import HttpResponse


class FileUtils:
    @staticmethod
    def is_filename_allowed(filename: str) -> bool:
        return (
            "." in filename
            and filename.rsplit(".", 1)[1].lower() in ALLOWED_FILE_EXTENSIONS
        )

    @staticmethod
    def read_csv(file) -> Optional[DataFrame]:
        try:
            df = read_csv(file, header=0, skipinitialspace=True)
        except ParserError:
            df = None
        return df

    @staticmethod
    def read_excel(file) -> Optional[DataFrame]:
        try:
            df = read_excel(file, header=0)
        except ParserError:
            df = None
        return df

    @classmethod
    def file_to_dataframe(cls, file: FileStorage) -> Optional[DataFrame]:
        convert_funcs_by_type = {".csv": cls.read_csv, ".xlsx": cls.read_excel}
        filename = str(file.filename)

        for extension, func in convert_funcs_by_type.items():
            if filename.endswith(extension):
                return func(file)

        return None

    @staticmethod
    def dataframe_to_csv_file(data: DataFrame) -> BytesIO:
        csv_file = BytesIO()

        data.to_csv(csv_file, index=False)

        csv_file.seek(0)
        return csv_file

    @staticmethod
    def dataframe_to_xlsx_file(data: DataFrame) -> BytesIO:
        excel_file = BytesIO()

        data.to_excel(excel_writer=excel_file, sheet_name="Sheet", index=False)

        excel_file.seek(0)
        return excel_file

    @staticmethod
    def dataframe_to_file(data: DataFrame, file_extension: str) -> BytesIO | None:
        convert_funcs_by_type = {
            "csv": FileUtils.dataframe_to_csv_file,
            "xlsx": FileUtils.dataframe_to_xlsx_file,
        }
        func = convert_funcs_by_type.get(file_extension)
        if not func:
            return None

        return func(data)


# Decorators
def file_attached_required(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        # File was not uploaded
        if "file" not in request.files:
            return HttpErrorResponse("File was NOT uploaded")

        file_obj = request.files["file"]

        # File was not selected
        if not (file_obj and file_obj.filename):
            return HttpErrorResponse("File was NOT selected")

        # File with a not allowed extension
        if not FileUtils.is_filename_allowed(filename=file_obj.filename):
            return HttpResponse("File extension is NOT allowed")
        return function(*args, **kwargs)

    return decorated_function
