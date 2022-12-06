import PageHeader from "../components/PageHeader";
import React from "react";
import {Image} from "react-bootstrap";
import BicycleStationsExample from '../media/bicycle_stations_data_example.png';
import BicycleHiresExample from '../media/bicycle_hires_data_example.png';

function Readme() {
    return (
        <div className={"mb-5"}>
            <PageHeader>README</PageHeader>

            <h3>Import & Export data format:</h3>
            <p><b>Bicycle Stations</b> data:</p>
            <Image src={BicycleStationsExample} alt={'Bicycle Stations data example'}
                   className={"img-fluid img-thumbnail"}/>

            <p className={"mt-3"}><b>Bicycle Hires</b> data:</p>
            <Image src={BicycleHiresExample} alt={'Bicycle Hires data example'} className={"img-fluid img-thumbnail"}/>
            <hr/>
            <h3>Main cleaning data steps priority:</h3>
            <p>1) NaN, INF, -INF replaced to 0</p>
            <p>2) Checked data types</p>
            <p>3) Duplicates dropped</p>
            <p>4) If the row exists in the DB it will be replaced</p>
        </div>
    )
}

export default Readme;