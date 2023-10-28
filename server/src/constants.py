import enum

DATE_FORMAT = "%d/%m/%Y"
EARTH_RADIUS = 6371e3  # Earth radius in meters
ALLOWED_FILE_EXTENSIONS = ("csv", "xlsx")

# Pagination
ROWS_PER_PAGE = 10


class FileDataType(enum.Enum):
    NONE = 0
    BICYCLE_STATIONS = 1
    BICYCLE_RENTALS = 2


class Weekday(enum.Enum):
    MONDAY = (0, "Monday")
    TUESDAY = (1, "Tuesday")
    WEDNESDAY = (2, "Wednesday")
    THURSDAY = (3, "Thursday")
    FRIDAY = (4, "Friday")
    SATURDAY = (5, "Saturday")
    SUNDAY = (6, "Sunday")

    def __init__(self, index, title):
        self.index = index
        self.title = title
