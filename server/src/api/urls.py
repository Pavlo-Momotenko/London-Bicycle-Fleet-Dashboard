from flask import Blueprint

from src.api.bicycle_rentals import (
    BicycleRentalsAPI,
    BicycleRentalsLogsAPI,
    BicycleRentalsExportAPI,
)
from src.api.bicycle_stations import (
    BicycleStationsAPI,
    BicycleStationsLogsAPI,
    BicycleStationsExportAPI,
)
from src.api.data_analysis import NearestStationsToLocationAPI, AverageDistanceBetweenStationsAPI
from src.api.data_visualization import (
    RentalDurationDistributionAPI,
    WeekdayStationsPopularityAPI, StationsTurnoverRateMapAPI, StationsMapAPI,
)

# Export data blueprint
# Base api urls blueprint
api_urls_blueprint = Blueprint("api_urls", __name__, url_prefix="/api")

# Bicycle stations
bicycle_stations_blueprint = Blueprint(
    "bicycle_stations", __name__, url_prefix="/bicycle-stations"
)
api_urls_blueprint.register_blueprint(bicycle_stations_blueprint)
bicycle_stations_blueprint.add_url_rule(
    "", view_func=BicycleStationsAPI.as_view("bicycle_stations")
)
bicycle_stations_blueprint.add_url_rule(
    "/logs", view_func=BicycleStationsLogsAPI.as_view("bicycle_stations_logs")
)
bicycle_stations_blueprint.add_url_rule(
    "/export", view_func=BicycleStationsExportAPI.as_view("bicycle_stations_export")
)

# Bicycle rentals
bicycle_rentals_blueprint = Blueprint(
    "bicycle_rentals", __name__, url_prefix="/bicycle-rentals"
)
api_urls_blueprint.register_blueprint(bicycle_rentals_blueprint)
bicycle_rentals_blueprint.add_url_rule(
    "", view_func=BicycleRentalsAPI.as_view("bicycle_rentals")
)
bicycle_rentals_blueprint.add_url_rule(
    "/logs", view_func=BicycleRentalsLogsAPI.as_view("bicycle_rentals_logs")
)
bicycle_rentals_blueprint.add_url_rule(
    "/export", view_func=BicycleRentalsExportAPI.as_view("bicycle_rentals_export")
)

# Data visualization
data_visualization_blueprint = Blueprint(
    "data_visualization", __name__, url_prefix="/data-visualization"
)
api_urls_blueprint.register_blueprint(data_visualization_blueprint)

# Weekday stations popularity
data_visualization_blueprint.add_url_rule(
    "/weekday-stations-popularity",
    view_func=WeekdayStationsPopularityAPI.as_view("weekday_stations_popularity"),
)
# Rental duration distribution
data_visualization_blueprint.add_url_rule(
    "/rental-duration-distribution",
    view_func=RentalDurationDistributionAPI.as_view("rental-duration-distribution"),
)
# Map most turnover rate stations
data_visualization_blueprint.add_url_rule(
    "/stations-turnover-rate-map",
    view_func=StationsTurnoverRateMapAPI.as_view("stations_turnover_rate_map"),
)
# Stations map
data_visualization_blueprint.add_url_rule(
    "/stations-map",
    view_func=StationsMapAPI.as_view("stations_map")
)

# Data analysis
data_analysis_blueprint = Blueprint(
    "data_analysis", __name__, url_prefix="/data-analysis"
)
api_urls_blueprint.register_blueprint(data_analysis_blueprint)

# Nearest to location
data_analysis_blueprint.add_url_rule(
    "/nearest-to-location",
    view_func=NearestStationsToLocationAPI.as_view("nearest_to_location"),
)
# Average distance between stations
data_analysis_blueprint.add_url_rule(
    "/stations-average-distance",
    view_func=AverageDistanceBetweenStationsAPI.as_view("average-stations-distance"),
)
