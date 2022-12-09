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
                    "/api/top_popular/" + ordering,
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

        let numberOfRows = 0
        if (data) {
            let values = Object.values(data);
            for (let i in values) {
                numberOfRows += values[i].length
            }
        }

        return (
            <>
                {
                    numberOfRows > 0 ? (
                            Object.entries(data).map(([weekDay, values], i) => (
                                    <div key={i}>
                                        <h4>{weekDay.slice(1)}</h4>
                                        {
                                            values.length > 0 && (
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
                                                        values.map((item, j) => (
                                                            <tr key={j}>
                                                                <td>{item.id}</td>
                                                                <td>{item.station_name}</td>
                                                                <td>{item.times_used}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                </Table>
                                            )
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