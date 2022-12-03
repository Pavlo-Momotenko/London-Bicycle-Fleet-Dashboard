import PageHeader from "../components/PageHeader";
import NearestToHome from "../components/data_analysis/NearestToHome";
import AverageDistanceBetweenStations from "../components/data_analysis/AverageDistanceBetweenStations";

function DataAnalysis() {
    return (
        <div className={"mb-5"}>
            <PageHeader>Data Analysis</PageHeader>
            <h3>The nearest station to home:</h3>
            <NearestToHome/>
            <hr/>
            <h3>Average distance between stations: </h3>
            <AverageDistanceBetweenStations/>
        </div>
    )
}

export default DataAnalysis;