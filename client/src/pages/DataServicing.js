import React from 'react';

import FileImportForm from "../components/data_servicing/FileImportForm";


class DataServicing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <h1>Home</h1>

                <h3>Data import (*.csv, *.xlsx) </h3>
                <p><b>Any new uploaded data will replace saved data.</b></p>

                <p>Import <b>Bicycle Stations</b> data:</p>
                <FileImportForm url={'bicycle_station'}/>

                <p className={"mt-3"}>Import <b>Bicycle Hires</b> data:</p>
                <FileImportForm url={'bicycle_hire'}/>
            </>
        );
    }
}

export default DataServicing;