import React, {useState} from "react";
import BlockPlaceholder from "../BlockPlaceholder";
import {Button, InputGroup, Table} from "react-bootstrap";
import {v4 as uuidv4} from 'uuid';
import Form from "react-bootstrap/Form";

function NearestToHome() {
    const [options, setOptions] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);

    function handleLatChange(event) {
        setLat(event.target.value)
    }

    function handleLonChange(event) {
        setLon(event.target.value)
    }
    function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        async function submitData() {
            const formData = new FormData();
            formData.append('latitude', lat);
            formData.append('longitude', lon)

            const response = await fetch(
                "/api/nearest_to_point",
                {
                    method: 'POST',
                    body: formData
                }
            );
            setOptions(await response.json());
            return 'ok';
        }

        submitData().then(r => console.log("POST options in (NearestToHome) : " + r)).finally(() => setIsLoading(false));
    }

    return (
        <>
            <p>Please, enter latitude and longitude of your home destination.</p>
            <Form onSubmit={handleSubmit}
                  className={"mb-3 d-flex justify-content-between align-content-center flex-nowrap"}>
                <InputGroup controlid="formLat" className={"flex-sm-fill me-3 w-auto"}>
                    <InputGroup.Text id="lat-text">Latitude</InputGroup.Text>
                    <Form.Control disabled={isLoading} aria-describedby="lat-text" type="number" step="0.01"
                                  onChange={handleLatChange} required={true}/>

                </InputGroup>

                <InputGroup controlid="formLon" className={"flex-sm-fill me-3 w-auto"}>
                    <InputGroup.Text id="lon-text">Longitude</InputGroup.Text>
                    <Form.Control disabled={isLoading} aria-describedby="lon-text" type="number" step="0.01"
                                  onChange={handleLonChange} required={true}/>
                </InputGroup>

                <Button type={"submit"} disabled={isLoading} className={"me-3"}>Find nearest stations 🔎️</Button>
            </Form>
            {
                options && options?.length > 0 ?
                    (
                        <Table bordered hover size={"sm"} responsive>
                            <thead key={uuidv4()}>
                            <tr key={uuidv4()}>
                                <th key={uuidv4()}>Latitude</th>
                                <th key={uuidv4()}>Longitude</th>
                                <th key={uuidv4()}>Station name</th>
                                <th key={uuidv4()}>Distance (m)</th>
                            </tr>
                            </thead>
                            <tbody key={uuidv4()}>
                            {
                                options.map((values, i) => (
                                    <tr key={uuidv4()}>
                                        <td key={uuidv4()}>{values.lat}</td>
                                        <td key={uuidv4()}>{values.lon}</td>
                                        <td key={uuidv4()}>{values.name}</td>
                                        <td key={uuidv4()}>{values.meters_distance}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>) : (<BlockPlaceholder>Nothing to display 👀</BlockPlaceholder>)
            }
        </>
    )
}

export default NearestToHome;