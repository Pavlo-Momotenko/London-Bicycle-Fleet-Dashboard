import FileImportForm from "../components/FileImportForm";

function Home() {
    return (
        <div className={"mb-5"}>
            <h1>Home</h1>
            <h3>Data import (*.csv, *.xlsx) </h3>
            <p><b>Any new uploaded data will overwrite saved data by id/rental_id fields</b></p>
            <p>Import <b>Bicycle Stations</b> data:</p>
            <FileImportForm  data_input_type={'bicycle_station'}/>
            <p className={"mt-3"}>Import <b>Bicycle Hires</b> data:</p>
            <FileImportForm data_input_type={'bicycle_hire'}/>
        </div>
    )
}

export default Home;