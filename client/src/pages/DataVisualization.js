import PageHeader from "../components/PageHeader";
import DataOverview from "../components/data_visualisation/DataOverview";
import Chart from "../components/data_visualisation/Chart";
import Top10 from "../components/data_visualisation/Top10";
import MapChart from "../components/data_visualisation/MapChart";

function DataVisualization() {

    return (
        <div className={"mb-5"}>
            <PageHeader>Data Visualization</PageHeader>
            <h3>Data overview</h3>
            <h5>1️⃣ Bicycle Stations data:</h5>
            <DataOverview dataInputType={"bicycle_station"}/>
            <h5>2️⃣ Bicycle Hires data:</h5>
            <DataOverview dataInputType={"bicycle_hire"}/>

            <hr/>

            <h3>Top 10 of MOST popular stations regarding the weekdays:</h3>
            <Top10 ordering={"desc"}/>

            <h3>Top 10 of LESS popular stations regarding the weekdays:</h3>
            <Top10 ordering={"asc"}/>

            <hr/>

            <h3>The distribution of bike rental duration:</h3>
            <Chart url={"distribution_chart"}/>
            <hr/>
            <h3>Where are the rental stations that have the most turnover rate? (top 10)</h3>
            <MapChart url={"most_turnover"}/>
            <hr/>
            <h3>Map of the stations:</h3>
            <MapChart url={"stations_map"}/>

        </div>
    )
}

export default DataVisualization;