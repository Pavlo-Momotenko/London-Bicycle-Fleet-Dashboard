import {useEffect, useState} from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import BlockPlaceholder from "../BlockPlaceholder";

function Chart({url}) {
    const [options, setOptions] = useState();

    useEffect(() => {
        async function getData() {
            const response = await fetch(
                "/api/chart/" + url,
                {
                    method: 'GET',
                }
            );
            setOptions(await response.json());
            return 'ok';
        }

        getData().then(r => console.log("GET options in (" + url + ') : ' + r));
    }, []);

    return (
        <>
            {
                options ?
                    (
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    ) : (<BlockPlaceholder>Nothing to display 👀</BlockPlaceholder>)
            }
        </>
    )
}

export default Chart;