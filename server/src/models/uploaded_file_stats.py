from src.constants import FileDataType
from src.models.base import Base
from src.models.db_obj import db


class UploadedFileStats(Base):
    __tablename__ = "uploaded_file_stat"

    name = db.Column(db.String(256), nullable=False)
    uploaded_at = db.Column(
        db.DateTime, default=db.func.now(), server_default=db.func.now(), nullable=False
    )
    rows_count = db.Column(db.Integer, nullable=False)
    file_data_type = db.Column(
        db.Integer, default=FileDataType.NONE.value, nullable=False
    )
