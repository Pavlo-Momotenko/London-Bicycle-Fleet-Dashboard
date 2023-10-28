import React from 'react';

import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import highchartsMap from "highcharts/modules/map";
import mapData from "@highcharts/map-collection/countries/gb/gb-all.geo.json";
import proj4 from "proj4";

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";
import apiUrls from "../../apiUrls";


class StationsMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            series: []
        };
    }

    componentDidMount() {
        highchartsMap(Highcharts);

        if (typeof window !== "undefined") {
            window.proj4 = window.proj4 || proj4;
        }

        this.setState(
            {isLoading: true},
            async function () {
                await fetch(
                    apiUrls.dataVisualization.stationsMap,
                    {
                        method: "GET",
                    }
                ).then(
                    (response) => {
                        return response.json();
                    }
                ).then(
                    (series) => {
                        this.setState({series: series, isLoading: false});
                    }
                );
            }
        );
    }

    render() {
        let isLoading = this.state.isLoading,
            series = this.state.series;

        if (isLoading) {
            return <LoadingPlaceholder/>
        }

        if (!series || series?.length < 0) {
            return <BlockPlaceholder/>
        }

        /**
         * @param series Contains data about point
         * @param series.stationId Station id
         * @param series.locationName Location name
         * @param series.locationLatitude Location latitude
         * @param series.locationLongitude Location longitude
         */
        let formattedSeries = series.map(item => {
            return {
                id: item.stationId,
                name: item.locationName,
                lat: item.locationLatitude,
                lon: item.locationLongitude,
            };
        });

        return (
            <HighchartsReact
                constructorType={"mapChart"}
                highcharts={Highcharts}
                options={
                    {
                        chart: {
                            map: "countries/ie/ie-all"
                        },
                        title: {
                            text: ""
                        },
                        credits: {
                            enabled: false
                        },
                        mapNavigation: {
                            enabled: true
                        },
                        tooltip: {
                            headerFormat: "",
                            pointFormat: "<b>Station ID: {point.id}</b><br>Location: {point.name} | Lat: {point.lat:.2f} | Lon: {point.lon:.2f}"
                        },
                        series: [
                            {
                                // Use the gb-all map with no data as a basemap
                                name: "Great Britain",
                                mapData: mapData,
                                borderColor: "#A0A0A0",
                                nullColor: "rgba(200, 200, 200, 0.3)",
                                showInLegend: false
                            },
                            {
                                type: "mappoint",
                                name: "Locations",
                                color: "#4169E1",
                                showInLegend: false,
                                data: formattedSeries,
                                cursor: "pointer"
                            }
                        ]
                    }
                }
            />
        );
    }
}

export default StationsMap;