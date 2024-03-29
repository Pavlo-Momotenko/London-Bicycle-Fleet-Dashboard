import React from "react";

import {Button, InputGroup, Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";
import apiUrls from "../../apiUrls";


class NearestToLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            lat: null,
            lon: null
        };
    }

    handleLatChange = (event) => {
        this.setState({lat: event.target.value});
    }

    handleLonChange = (event) => {
        this.setState({lon: event.target.value});
    }

    handlePostData = (event) => {
        event.preventDefault();

        let lat = this.state.lat,
            lon = this.state.lon;

        this.setState(
            {isLoading: true},
            async function () {
                await fetch(
                    apiUrls.dataAnalysis.nearestStationsToLocation.concat("?", new URLSearchParams({latitude: lat, longitude: lon}).toString()),
                    {
                        method: "GET",
                    }
                ).then(
                    (response) => {
                        return response.json();
                    }
                ).then(
                    (data) => {
                        this.setState({data: data, isLoading: false});
                    }
                );
            }
        );
    }

    render() {
        let isLoading = this.state.isLoading,
            data = this.state.data,
            handlePostData = this.handlePostData,
            handleLatChange = this.handleLatChange,
            handleLonChange = this.handleLonChange;

        return (
            <>
                <p>Please, enter latitude and longitude of your location.</p>
                <Form onSubmit={handlePostData}
                      className={"mb-3 d-flex justify-content-between align-content-center flex-nowrap"}>
                    <InputGroup controlid="formLat" className={"flex-sm-fill me-3 w-auto"}>
                        <InputGroup.Text id="lat-text">Latitude</InputGroup.Text>
                        <Form.Control disabled={isLoading} aria-describedby="lat-text" type="number" step="0.000001"
                                      onChange={handleLatChange} required={true}/>
                    </InputGroup>

                    <InputGroup controlid="formLon" className={"flex-sm-fill me-3 w-auto"}>
                        <InputGroup.Text id="lon-text">Longitude</InputGroup.Text>
                        <Form.Control disabled={isLoading} aria-describedby="lon-text" type="number" step="0.000001"
                                      onChange={handleLonChange} required={true}/>
                    </InputGroup>

                    <Button type={"submit"} disabled={isLoading}>Find nearest stations 🔎️</Button>
                </Form>
                {
                    isLoading
                        ? <LoadingPlaceholder/>
                        : data.length > 0
                            ? (
                                <Table bordered hover size={"sm"} responsive>
                                    <thead>
                                    <tr>
                                        <th>Station ID</th>
                                        <th>Location name</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                        <th>Distance (m)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        /**
                                         * @param values Contains data about nearest to point
                                         * @param values.stationId Station id
                                         * @param values.latitude Station point latitude
                                         * @param values.longitude Station point longitude
                                         * @param values.locationName Station name
                                         * @param values.distance Distance value in meters
                                         */
                                        data.map((values, i) => (
                                            <tr key={i}>
                                                <td>{values.stationId}</td>
                                                <td>{values.locationName}</td>
                                                <td>{values.latitude}</td>
                                                <td>{values.longitude}</td>
                                                <td>{values.distance}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                            )
                            : <BlockPlaceholder/>
                }
            </>
        );
    }
}

export default NearestToLocation;