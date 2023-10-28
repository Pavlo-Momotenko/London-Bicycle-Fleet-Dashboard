import React from 'react';

import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";
import apiUrls from "../../apiUrls";


class RentalDurationDistribution extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            series: []
        };
    }

    componentDidMount() {
        this.setState(
            {isLoading: true},
            async function () {
                await fetch(
                    apiUrls.dataVisualization.rentalDurationDistribution,
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
                    series?.length > 0 ? (
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={
                                    {
                                        chart: {
                                            type: "scatter",
                                            zoomType: "xy"
                                        },
                                        title: {
                                            text: "",
                                        },
                                        credits: {
                                            enabled: false
                                        },
                                        xAxis: {
                                            title: {
                                                text: "Duration"
                                            }
                                        },
                                        yAxis: {
                                            title: {
                                                text: "Count"
                                            }
                                        },
                                        plotOptions: {
                                            scatter: {
                                                tooltip: {
                                                    headerFormat: "",
                                                    pointFormat: "Duration: {point.x}</br>Count: {point.y}"
                                                }
                                            }
                                        },
                                        series: [
                                            {
                                                showInLegend: false,
                                                color: "#4169E1",
                                                cursor: "pointer",
                                                data: series
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

export default RentalDurationDistribution;