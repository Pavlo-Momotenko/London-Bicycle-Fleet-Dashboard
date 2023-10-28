import React from 'react';

import PageHeader from "../components/PageHeader";
import DataOverview from "../components/DataVisualisation/DataOverview";
import RentalDurationDistribution from "../components/DataVisualisation/RentalDurationDistribution";
import WeekdayStationsPopularity from "../components/DataVisualisation/WeekdayStationsPopularity";
import StationsMap from "../components/DataVisualisation/StationsMap";
import apiUrls from "../apiUrls";
import StationsTurnoverRateMap from "../components/DataVisualisation/StationsTurnoverRateMap";


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
                <DataOverview tableTitle={"Bicycle Stations data:"} url={apiUrls.bicycleStations.root}/>
                <DataOverview tableTitle={"Bicycle Rentals data:"} url={apiUrls.bicycleRentals.root}/>

                <hr/>

                <h3>Top 10 most popular weekday stations:</h3>
                <WeekdayStationsPopularity ordering={"desc"}/>
                <h3>Top 10 least popular weekday stations:</h3>
                <WeekdayStationsPopularity ordering={"asc"}/>

                <hr/>

                <h3>The distribution of bike rental duration:</h3>
                <RentalDurationDistribution/>

                <hr/>

                <h3>Where are the rental stations that have the most turnover rate?</h3>
                <StationsTurnoverRateMap/>

                <hr/>

                <h3>Stations map:</h3>
                <StationsMap/>
            </>
        );
    }
}

export default DataVisualization;