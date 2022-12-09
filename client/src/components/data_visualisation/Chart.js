import React from 'react';

import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";


class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            series: []
        };
    }

    componentDidMount() {
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
                    series.length > 0 ? (
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
                                                text: "Number of times"
                                            }
                                        },
                                        plotOptions: {
                                            scatter: {
                                                tooltip: {
                                                    headerFormat: "<b>Bike Distribution</b><br>",
                                                    pointFormat: "{point.x} duration, {point.y} number of times"
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

export default Chart;