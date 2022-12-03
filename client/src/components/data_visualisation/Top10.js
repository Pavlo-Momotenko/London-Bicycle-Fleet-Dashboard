import {useEffect, useState} from "react";
import BlockPlaceholder from "../BlockPlaceholder";
import {Table} from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

function Top10({ordering}) {
    const [options, setOptions] = useState();

    useEffect(() => {
        async function getData() {
            const response = await fetch(
                "/api/top_popular/" + ordering,
                {
                    method: 'GET',
                }
            );
            setOptions(await response.json());
            return 'ok';
        }

        getData().then(r => console.log("GET options in (Top10) : " + r));
    }, []);
    let num_of_rows = 0
    if (options) {
        let values = Object.values(options);
        for (var i in values) {
            num_of_rows += values[i].length
        }
    }
    return (
        <>
            {
                num_of_rows > 0 ?
                    (
                        Object.entries(options).map(([key, value], i) => (
                                <div key={uuidv4()}>
                                    <h4 key={uuidv4()}>{key.slice(1)}</h4>
                                    {
                                        value.length > 0 ? (
                                            <Table bordered hover size={"sm"} responsive key={'table' + i+key}>
                                                <thead key={uuidv4()}>
                                                <tr key={uuidv4()}>
                                                    <th key={uuidv4()}>Station ID</th>
                                                    <th key={uuidv4()}>Station Name</th>
                                                    <th key={uuidv4()}>Times used</th>
                                                </tr>
                                                </thead>
                                                <tbody key={uuidv4()}>
                                                {
                                                    value.map((item, j) => (
                                                        <tr key={uuidv4()}>
                                                            <td key={uuidv4()}>{item[0]}</td>
                                                            <td key={uuidv4()}>{item[1]}</td>
                                                            <td key={uuidv4()}>{item[2]}</td>
                                                        </tr>

                                                    ))
                                                }
                                                </tbody>
                                            </Table>
                                        ) : null
                                    }
                                </div>
                            )
                        )
                    ) : (<BlockPlaceholder>Nothing to display 👀</BlockPlaceholder>)
            }
        </>
    )
}

export default Top10;