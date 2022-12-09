import React from 'react';

import PageHeader from "../components/PageHeader";
import DataOverview from "../components/data_visualisation/DataOverview";
import Chart from "../components/data_visualisation/Chart";
import Top10Table from "../components/data_visualisation/Top10Table";
import MapChart from "../components/data_visualisation/MapChart";


class DataVisualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <PageHeader>Data Visualization</PageHeader>
                <h3>Data overview</h3>
                <h5>1️⃣ Bicycle Stations data:</h5>
                <DataOverview url={"bicycle_station"}/>
                <h5>2️⃣ Bicycle Hires data:</h5>
                <DataOverview url={"bicycle_hire"}/>

                <hr/>

                <h3>Top 10 of MOST popular stations regarding the weekdays:</h3>
                <Top10Table ordering={"desc"}/>
                <hr/>
                <h3>Top 10 of LESS popular stations regarding the weekdays:</h3>
                <Top10Table ordering={"asc"}/>

                <hr/>

                <h3>The distribution of bike rental duration:</h3>
                <Chart url={"distribution_chart"}/>
                <hr/>
                <h3>Where are the rental stations that have the most turnover rate?</h3>
                <MapChart url={"most_turnover"}/>
                <hr/>
                <h3>Map of the stations:</h3>
                <MapChart url={"stations_map"}/>
            </>
        );
    }
}

export default DataVisualization;