import React from "react";

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";
import apiUrls from "../../apiUrls";


class AverageDistanceBetweenStations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            number: null
        };
    }

    componentDidMount() {
        this.setState(
            {isLoading: true},
            async function () {
                await fetch(
                    apiUrls.dataAnalysis.stationsAverageDistance,
                    {
                        method: "GET",
                    }
                ).then(
                    (response) => {
                        return response.json();
                    }
                ).then(
                    (number) => {
                        this.setState({number: number, isLoading: false});
                    }
                );
            }
        );
    }

    render() {
        let number = this.state.number,
            isLoading = this.state.isLoading;

        if (isLoading) {
            return <LoadingPlaceholder/>
        }

        return (
            <>
                {
                    number
                        ? (
                            <div className={"d-flex justify-content-center align-items-center"}>
                                <h1>{number} m</h1>
                            </div>
                        )
                        : <BlockPlaceholder/>
                }
            </>
        );
    }
}

export default AverageDistanceBetweenStations;