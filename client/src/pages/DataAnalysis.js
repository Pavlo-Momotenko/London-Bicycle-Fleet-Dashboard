import PageHeader from "../components/PageHeader";
import NearestToHome from "../components/data_analysis/NearestToHome";

function DataAnalysis() {
    return (
        <>
            <PageHeader>Data Analysis</PageHeader>
            <h3>The nearest station to home:</h3>
            <NearestToHome/>
            <h3>Avg distance between stations: </h3>

        </>
    )
}

export default DataAnalysis;