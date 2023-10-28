import React from "react";

import PageHeader from "../components/PageHeader";
import NearestToLocation from "../components/DataAnalysis/NearestToLocation";
import AverageDistanceBetweenStations from "../components/DataAnalysis/AverageDistanceBetweenStations";


class DataAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <PageHeader>Data Analysis</PageHeader>

                <h3>Nearest stations to location:</h3>
                <NearestToLocation/>

                <hr/>

                <h3>Average distance between stations: </h3>
                <AverageDistanceBetweenStations/>
            </>
        );
    }
}

export default DataAnalysis;