import React from "react";

import PageHeader from "../components/PageHeader";
import NearestToPoint from "../components/data_analysis/NearestToPoint";
import AverageDistanceBetweenStations from "../components/data_analysis/AverageDistanceBetweenStations";


class DataAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <PageHeader>Data Analysis</PageHeader>
                <h3>The nearest station to home:</h3>
                <NearestToPoint/>
                <hr/>
                <h3>Average distance between stations: </h3>
                <AverageDistanceBetweenStations/>
            </>
        );
    }
}

export default DataAnalysis;