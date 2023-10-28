import React from 'react';

import {Table} from "react-bootstrap";

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";
import apiUrls from "../../apiUrls";


class WeekdayStationsPopularity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: null
        };
    }

    componentDidMount() {
        let ordering = this.props.ordering;

        this.setState(
            {isLoading: true},
            async function () {
                await fetch(
                    apiUrls.dataVisualization.weekdayStationsPopularity.concat("?", new URLSearchParams({ordering: ordering}).toString()),
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
        let data = this.state.data,
            isLoading = this.state.isLoading;

        if (isLoading) {
            return <LoadingPlaceholder/>
        }

        if (!data?.isAnyData) {
            return <BlockPlaceholder/>
        }

        return (
            <>
                {
                    /**
                     * @param data Contains general data about weekdays and relevant data
                     * @param data.isAnyData Is there any data to display in any week_day_data
                     * @param data.weekDays Contains titles of week days
                     * @param data.weekDaysData Contains data for each week day
                     */
                    data.weekDays.map((weekDay, i) => (
                            <div key={i}>
                                <h4>{weekDay}</h4>
                                {
                                    data.weekDaysData[i].length > 0 ? (
                                        <Table bordered hover size={"sm"} responsive>
                                            <thead>
                                            <tr>
                                                <th>Station ID</th>
                                                <th>Terminal name</th>
                                                <th>Number of rentals</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                /**
                                                 * @param item Contains data about station
                                                 * @param item.id Station id
                                                 * @param item.stationName Station name
                                                 * @param item.numberOfRentals How many times stations were used
                                                 */
                                                data.weekDaysData[i].map((item, j) => (
                                                    <tr key={j}>
                                                        <td>{item.id}</td>
                                                        <td>{item.stationName}</td>
                                                        <td>{item.numberOfRentals}</td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </Table>
                                    ) : <p>No data</p>
                                }
                            </div>
                        )
                    )
                }
            </>
        );
    }
}

export default WeekdayStationsPopularity;