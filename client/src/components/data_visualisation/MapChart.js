import {useEffect, useState} from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import BlockPlaceholder from "../BlockPlaceholder";
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import mapDataIE from "@highcharts/map-collection/countries/gb/gb-all.geo.json";

function MapChart({url}) {
    highchartsMap(Highcharts);

    if (typeof window !== "undefined") {
        window.proj4 = window.proj4 || proj4;
    }

    const [series, setSeries] = useState();

    const mapOptions = {
        chart: {
            map: "countries/ie/ie-all"
        },
        title: {
            text: " "
        },
        credits: {
            enabled: false
        },
        mapNavigation: {
            enabled: true
        },
        tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.name}</b><br>Lat: {point.lat:.2f}, Lon: {point.lon:.2f}"
        },
        series: [
            {
                // Use the gb-all map with no data as a basemap
                name: "Great Britain",
                mapData: mapDataIE,
                borderColor: "#A0A0A0",
                nullColor: "rgba(200, 200, 200, 0.3)",
                showInLegend: false
            },
            {
                // Specify points using lat/lon
                type: "mappoint",
                name: "Locations",
                color: "#4169E1",
                accessibility: {
                    point: {
                        valueDaescriptionFormat: '{xDescription}. Lat: {point.lat:.2f}, lon: {point.lon:.2f}.'
                    }
                },
                data: series ? series : [], // [{'name': 'Liverpool', 'lat': 53.4, 'lon': -3}]
                cursor: "pointer",
                point: {
                    events: {
                        click: function () {
                            console.log(this.keyword);
                        }
                    }
                }
            }
        ]
    };

    useEffect(() => {
        async function getData() {
            const response = await fetch(
                "/api/chart/" + url,
                {
                    method: 'GET',
                }
            );
            setSeries(await response.json());
            return 'ok';
        }

        getData().then(r => console.log("GET options in (" + url + ') : ' + r));
    }, []);

    return (
        <>
            {
                series ?
                    (
                        <HighchartsReact
                            constructorType={"mapChart"}
                            highcharts={Highcharts}
                            options={mapOptions}
                        />
                    ) : (<BlockPlaceholder>Nothing to display 👀</BlockPlaceholder>)
            }
        </>
    )
}

export default MapChart;