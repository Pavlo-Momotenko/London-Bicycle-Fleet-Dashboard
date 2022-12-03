from flask import Flask
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    from app.data_servicing.views import UploadDataAPI, DownloadCSVAPI, DownloadExcelAPI
    app.add_url_rule(
        "/api/upload/<string:data_input_type>",
        view_func=UploadDataAPI.as_view('upload-data')
    )
    app.add_url_rule(
        "/api/download/csv/<string:data_input_type>",
        view_func=DownloadCSVAPI.as_view('download-data-csv')
    )
    app.add_url_rule(
        "/api/download/excel/<string:data_input_type>",
        view_func=DownloadExcelAPI.as_view('download-data-excel')
    )

    from app.data_visualization.views import DataPaginationAPI, TopPopularAPI, BikeDistributionChartAPI, \
        MostTurnoverRateStationChartAPI, StationsMapChartAPI
    app.add_url_rule(
        "/api/paginate/<int:page>/<string:data_input_type>",
        view_func=DataPaginationAPI.as_view('data-pagination')
    )
    app.add_url_rule(
        "/api/chart/distribution_chart",
        view_func=BikeDistributionChartAPI.as_view('distr-bike-chart')
    )
    app.add_url_rule(
        "/api/top_popular/<string:ordering>",
        view_func=TopPopularAPI.as_view('top-popular')
    )
    app.add_url_rule(
        "/api/chart/most_turnover",
        view_func=MostTurnoverRateStationChartAPI.as_view('most-turnover')
    )
    app.add_url_rule(
        "/api/chart/stations_map",
        view_func=StationsMapChartAPI.as_view('stations-map')
    )

    from app.data_analysis.views import NearestToPointAPI, AverageDistanceBetweenStationsAPI
    app.add_url_rule(
        "/api/nearest_to_point",
        view_func=NearestToPointAPI.as_view('nearest-to-point')
    )
    app.add_url_rule(
        "/api/avg_points_distance",
        view_func=AverageDistanceBetweenStationsAPI.as_view('avg-points-distance')
    )

    return app
