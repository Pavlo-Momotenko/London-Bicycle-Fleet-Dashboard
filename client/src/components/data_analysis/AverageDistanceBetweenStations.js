import {useEffect, useState} from "react";
import BlockPlaceholder from "../BlockPlaceholder";

function AverageDistanceBetweenStations() {
    const [num, setNum] = useState();

    useEffect(() => {
        async function getData() {
            const response = await fetch(
                "/api/avg_points_distance",
                {
                    method: 'GET',
                }
            );
            setNum(await response.json());
            return 'ok';
        }

        getData().then(r => console.log("GET options in (/api/avg_points_distance) : " + r));
    }, []);

    return (
        <>
            {
                num  ?
                    (
                        <div className={"d-flex justify-content-center align-items-center"}>
                            <h1>{num} m</h1>
                        </div>
                    ) : (<BlockPlaceholder>Nothing to display 👀</BlockPlaceholder>)
            }
        </>
    )
}

export default AverageDistanceBetweenStations;