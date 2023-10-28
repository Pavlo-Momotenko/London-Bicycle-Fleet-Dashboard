import React from "react";

import {Image} from "react-bootstrap";

import BicycleStationsExample from '../media/bicycle_stations_data_example.png';
import BicycleRentalsExample from '../media/bicycle_rentals_data_example.png';

import PageHeader from "../components/PageHeader";


class Readme extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <PageHeader>README</PageHeader>

                <h3>Import & Export data format:</h3>
                <p><b>Bicycle Stations</b> data:</p>
                <Image src={BicycleStationsExample} alt={'Bicycle Stations data example'}
                       className={"img-fluid img-thumbnail"}/>

                <p className={"mt-3"}><b>Bicycle Hires</b> data:</p>
                <Image src={BicycleRentalsExample} alt={'Bicycle Hires data example'}
                       className={"img-fluid img-thumbnail"}/>

                <hr/>

                <h3>Demo:</h3>
                <div className={"d-flex justify-content-center"}>
                    <iframe width="888" height="500" src="https://www.youtube.com/embed/1C8aJwPiq5E?si=M_F2_a6s4vpiqNLd"
                            title="YouTube video player" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen></iframe>
                </div>
            </>
        );
    }
}

export default Readme;