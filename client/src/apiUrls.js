const apiUrls = {
  bicycleStations: {
    root: "/api/bicycle-stations",
    logs: "/api/bicycle-stations/logs",
    export: "/api/bicycle-stations/export"
  },
  bicycleRentals: {
    root: "/api/bicycle-rentals",
    logs: "/api/bicycle-rentals/logs",
    export: "/api/bicycle-rentals/export"
  },
  dataVisualization: {
    weekdayStationsPopularity: "/api/data-visualization/weekday-stations-popularity",
    rentalDurationDistribution: "/api/data-visualization/rental-duration-distribution",
    stationsTurnoverRateMap: "/api/data-visualization/stations-turnover-rate-map",
    stationsMap: "/api/data-visualization/stations-map"
  },
  dataAnalysis: {
    nearestStationsToLocation: "/api/data-analysis/nearest-to-location",
    stationsAverageDistance: "/api/data-analysis/stations-average-distance"
  }
};

export default apiUrls;
