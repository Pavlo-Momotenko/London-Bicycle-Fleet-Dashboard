import {Pagination, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import BlockPlaceholder from "../BlockPlaceholder";

function DataOverview({dataInputType}) {
    const [tableData, setTableData] = useState();
    const [pageNum, setPageNum] = useState(1);

    useEffect(() => {
        async function getData() {
            let page = pageNum ? pageNum : 1
            const response = await fetch(
                "/api/paginate/" + page + "/" + dataInputType,
                {
                    method: 'GET',
                }
            );
            setTableData(await response.json());
            return 'ok';
        }

        getData().then(r => console.log("GET pagination in (" + dataInputType + ') : ' + r));
    }, [pageNum]);

    let NextComponent;
    if (tableData && tableData?.has_next && tableData.has_next) {
        NextComponent = (
            <Pagination.Next onClick={() => setPageNum(pageNum + 1)}/>
        )
    }
    let PrevComponent;
    if (tableData && tableData?.has_prev && tableData.has_prev) {
        PrevComponent = (
            <Pagination.Prev onClick={() => setPageNum(pageNum - 1)}/>
        )
    }
    return (
        <>
            <div className={"d-flex flex-nowrap justify-content-end"}>
                <Pagination>
                    {PrevComponent}
                    {NextComponent}
                </Pagination>
            </div>
            {
                tableData?.items ? (
                    <Table bordered hover size={"sm"} responsive>
                        <thead>
                        <tr>
                            {
                                tableData.headers.map((header, i) => (
                                    <th key={i}>{header}</th>
                                ))
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {
                            tableData.items.map((item, i) => (
                                <tr key={i + 'tr'}>
                                    {tableData.headers.map((header, j) => (
                                        <td key={i + header + j}>{item[header]?.toString()}</td>
                                    ))}
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>) : <BlockPlaceholder>Nothing to display 👀</BlockPlaceholder>
            }
        </>
    )
}

export default DataOverview;