import React from 'react';

import {Table} from "react-bootstrap";

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";


class Top10Table extends React.Component {
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
                    "/api/top_popular".concat("?", new URLSearchParams({ordering: ordering}).toString()),
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

        return (
            <>
                {
                    /**
                     * @param data Contains general data about weekdays and relevant data
                     * @param data.is_any_data Is there any data to display in any week_day_data
                     * @param data.week_days Contains titles of week days
                     * @param data.week_days_data Contains data for each week day
                     */
                    data && data.is_any_data ? (
                            data.week_days.map((weekDay, i) => (
                                    <div key={i}>
                                        <h4>{weekDay}</h4>
                                        {
                                            data.week_days_data[i].length > 0 ? (
                                                    <Table bordered hover size={"sm"} responsive>
                                                        <thead>
                                                        <tr>
                                                            <th>Station ID</th>
                                                            <th>Station Name</th>
                                                            <th>Times used</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            /**
                                                             * @param item Contains data about station
                                                             * @param item.id Station id
                                                             * @param item.station_name Station name
                                                             * @param item.times_used How many times station was used
                                                             */
                                                            data.week_days_data[i].map((item, j) => (
                                                                <tr key={j}>
                                                                    <td>{item.id}</td>
                                                                    <td>{item.station_name !== null ? item.station_name : 'N/A'}</td>
                                                                    <td>{item.times_used}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                        </tbody>
                                                    </Table>
                                                )
                                                : <p>No data</p>
                                        }
                                    </div>
                                )
                            )
                        )
                        : <BlockPlaceholder/>
                }
            </>
        );
    }
}

export default Top10Table;