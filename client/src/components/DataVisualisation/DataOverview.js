import React from 'react';

import {Pagination, Table, Placeholder, Button} from "react-bootstrap";

import BlockPlaceholder from "../BlockPlaceholder";
import LoadingPlaceholder from "../LoadingPlaceholder";


class DataOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            tableData: null,
            pageNum: 1
        };
    }

    handleGetData = () => {
        let url = this.props.url,
            pageNum = this.state.pageNum;

        this.setState(
            {isLoading: true},
            async function () {
                await fetch(
                    url.concat("?", new URLSearchParams({page: pageNum}).toString()),
                    {
                        method: "GET",
                    }
                ).then(
                    (response) => {
                        return response.json();
                    }
                ).then(
                    (data) => {
                        this.setState({tableData: data, isLoading: false});
                    }
                );
            }
        );
    }

    componentDidMount() {
        this.handleGetData();
    }

    render() {
        let handleGetData = this.handleGetData,
            tableTitle = this.props.tableTitle,
            tableData = this.state.tableData,
            pageNum = this.state.pageNum,
            isLoading = this.state.isLoading,
            PrevPageComponent,
            NextPageComponent;

        if (isLoading) {
            return (
                <>
                    <div className={"d-flex flex-nowrap justify-content-between align-items-center"}>
                        <h5>{tableTitle}</h5>
                        <Placeholder as={"p"} animation={"glow"} className={"d-flex flex-nowrap justify-content-end"}>
                            <Button size={"sm"} as={Placeholder.Button} variant={"secondary"} xs={1}/>
                        </Placeholder>
                    </div>
                    <LoadingPlaceholder/>
                </>
            )

        }

        if (tableData && tableData?.has_prev && tableData.has_prev) {
            PrevPageComponent = (
                <Pagination.Prev onClick={() => {
                    this.setState({pageNum: pageNum - 1}, handleGetData)
                }}/>
            )
        }
        if (tableData && tableData?.has_next && tableData.has_next) {
            NextPageComponent = (
                <Pagination.Next onClick={() => {
                    this.setState({pageNum: pageNum + 1}, handleGetData)
                }}/>
            )
        }

        return (
            <>
                <div className={"d-flex flex-nowrap justify-content-between align-items-center"}>
                    <h5>{tableTitle}</h5>
                    <Pagination>
                        {PrevPageComponent}
                        {NextPageComponent}
                    </Pagination>
                </div>
                {
                    tableData?.items
                        ? (
                            <Table bordered hover size={"sm"} responsive>
                                <thead>
                                <tr>
                                    {
                                        tableData.headers.map((header, i) => (
                                                <th key={i}>{header}</th>
                                            )
                                        )
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tableData.items.map((item, i) => (
                                        <tr key={i}>
                                            {tableData.headers.map((header, j) => (
                                                    <td key={j}>{item[header]?.toString()}</td>
                                                )
                                            )
                                            }
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

export default DataOverview;