import React from 'react';

import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import highchartsMap from "highcharts/modules/map";
import mapData from "@highcharts/map-collection/countries/gb/gb-all.geo.json";
import proj4 from "proj4";

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";


class MapChart extends React.Component {
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

        let url = this.props.url;

        this.setState(
            {isLoading: true},
            async function () {
                await fetch(
                    "/api/chart/" + url,
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

        return (
            <>
                {
                    series.length > 0
                        ? (
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
                                            pointFormat: "<b>{point.name}</b><br>Lat: {point.lat:.2f}, Lon: {point.lon:.2f}"
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
                                                // Specify points using lat/lon
                                                type: "mappoint",
                                                name: "Locations",
                                                color: "#4169E1",
                                                showInLegend: false,
                                                accessibility: {
                                                    point: {
                                                        valueDescriptionFormat: '{xDescription}. Lat: {point.lat:.2f}, lon: {point.lon:.2f}.'
                                                    }
                                                },
                                                data: series, // [{'name': 'Liverpool', 'lat': 53.4, 'lon': -3}]
                                                cursor: "pointer"
                                            }
                                        ]
                                    }
                                }
                            />
                        )
                        : <BlockPlaceholder/>
                }
            </>
        );
    }
}

export default MapChart;