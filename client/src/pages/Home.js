import React from 'react';

import FileUpload from "../components/Home/FileUpload";
import apiUrls from "../apiUrls";


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <h1>Home</h1>

                <h3>Data import (*.csv, *.xlsx) </h3>
                <p><b>New uploaded data will replace saved data by IDs.</b></p>

                <p>Import <b>Bicycle Stations</b> data:</p>
                <FileUpload urlGroup={apiUrls.bicycleStations}/>

                <p className={"mt-3"}>Import <b>Bicycle Rentals</b> data:</p>
                <FileUpload urlGroup={apiUrls.bicycleRentals}/>
            </>
        );
    }
}

export default Home;