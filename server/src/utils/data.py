from datetime import date, datetime
from typing import Any

from pandas import to_datetime, isnull


class DataUtils:
    @staticmethod
    def validate_numeric(
        value: Any,
        data_type: int | float = int,
        min_value: int | float | None = None,
        allowed_signed: bool = True,
        allowed_nullable: bool = True,
    ) -> bool:
        return (
            isinstance(value, data_type)
            and (allowed_nullable or not isnull(value))
            and (allowed_signed or ((value**2) ** 0.5) == value)
            and (min_value is None or value >= min_value)
        )

    @staticmethod
    def validate_data_by_types(
        value: Any, data_type: tuple | tuple[type], allowed_nullable: bool = True
    ) -> bool:
        nullable_check = allowed_nullable or not isnull(value)
        return nullable_check and isinstance(value, data_type)

    @staticmethod
    def convert_to_date(value: Any) -> date | None:
        converted = to_datetime(value, errors="coerce", utc=True).date()
        return None if isnull(converted) else converted

    @staticmethod
    def convert_to_datetime(value: Any) -> datetime | None:
        converted = to_datetime(value, errors="coerce", utc=True)
        return None if isnull(converted) else converted

    @staticmethod
    def convert_to_type(value: Any, convert_type: type) -> Any:
        try:
            return convert_type(value)
        except ValueError:
            return None
