import Form from "react-bootstrap/Form";
import {Accordion, Alert, Button, DropdownButton, Modal, Table} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import React, {useEffect, useState} from "react";
import BlockPlaceholder from "./BlockPlaceholder";
import "./FileImportForm.css";
import { saveAs } from 'file-saver';


function FileImportForm({data_input_type}) {
    const [isLoading, setIsLoading] = useState(false);

    // Files related
    const [file, setFile] = useState();
    const [fileList, setFileList] = useState();
    const [fileErrors, setFileErrors] = useState();
    const [fileSuccessMessage, setFileSuccessMessage] = useState();

    // Modal related
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleChange(event) {
        setFile(event.target.files[0])
    }

    function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setFileErrors(undefined);
        setFileSuccessMessage(undefined);

        async function submitData() {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('file_name', file?.name)

            const response = await fetch("/api/upload/" + data_input_type, {
                method: 'POST',
                body: formData
            });

            if (response.status === 200) {
                setFileSuccessMessage(await response.json());
            } else {
                setFileErrors(await response.json())
            }

            return 'ok'
        }

        submitData()
            .finally(() => setIsLoading(false))
            .then(r => console.log("POST data in (" + data_input_type + ') : ' + r));
    }

    useEffect(() => {
        async function getData() {
            const response = await fetch("/api/upload/" + data_input_type, {
                method: 'GET',
            });
            setFileList(await response.json());
            return 'ok'
        }

        if (typeof data_input_type !== "undefined") {
            getData()
                .finally(() => setIsLoading(false))
                .then(r => console.log("GET data in (" + data_input_type + ') : ' + r));
        }
    }, [fileSuccessMessage, fileErrors]);

    function handleDelete(event) {
        event.preventDefault();
        setIsLoading(true);
        setShow(false);
        setFileErrors(undefined);
        setFileSuccessMessage(undefined);

        async function deleteData() {
            const response = await fetch("/api/upload/" + data_input_type, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                setFileSuccessMessage(await response.json());
            } else {
                setFileErrors(await response.json())
            }

            return 'ok'
        }

        deleteData()
            .finally(() => setIsLoading(false))
            .then(r => console.log("DELETE data in (" + data_input_type + ') : ' + r));
    }

    function handleDownload(event, file_extension) {
        event.preventDefault();
        setIsLoading(true);
        setFileErrors(undefined);
        setFileSuccessMessage(undefined);

        async function downloadData() {
            const response = await fetch("/api/download/" + file_extension + "/" + data_input_type, {
                method: 'GET',
            }).then(function (response) {
                    return response.blob();
                }
            )
                .then(function (blob) {
                    if (file_extension === 'csv') {
                        let a = document.createElement("a");
                        a.href = window.URL.createObjectURL(blob);
                        a.download = "export.csv";
                        a.click();
                    } else {
                        saveAs(new Blob([blob], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), 'export.xlsx');
                    }
                })
                .catch(error => {
                    console.log(error);
                });


            return 'ok'
        }

        downloadData()
            .finally(() => setIsLoading(false))
            .then(r => console.log("GET data in (" + data_input_type + ') : ' + r));
    }

    let Errors;
    if (fileErrors?.errors) {
        Errors = (
            <Accordion className={"mb-3"}>
                <Accordion.Item eventKey={"0"}>
                    <Accordion.Header>Some error occurred❗️</Accordion.Header>
                    <Accordion.Body className={"overflow-auto mh-10"}>
                        {
                            fileErrors.errors.map((error_message, index) => (
                                <p key={index + data_input_type}>🚫 {error_message}</p>
                            ))
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }

    let Success;
    if (fileSuccessMessage?.success) {
        Success = (
            <Alert key={"success" + data_input_type} variant={"success"}>
                ✅ {fileSuccessMessage.success}
            </Alert>
        )
    }
    return (
        <>
            {Success}
            {Errors}
            <Form onSubmit={handleSubmit}
                  className={"mb-3 d-flex justify-content-between align-content-center flex-nowrap"}>
                <Form.Group controlId="formBicycleStationsFile" className={"flex-sm-fill me-3"}>
                    <Form.Control type="file" disabled={isLoading}
                                  accept=".csv,.xlsx" onChange={handleChange} required={true}/>
                </Form.Group>
                <Button type={"submit"} disabled={isLoading} className={"me-3"}>Upload data ⬆️</Button>
                {fileList?.files ? (
                    <>
                        <Button variant={"danger"} disabled={isLoading} onClick={handleShow} className={"me-3"}> Drop
                            🗑</Button>
                        {/*<Button variant={"success"} disabled={isLoading} onClick={handleDownload}> Download ⬇️</Button>*/}
                        <DropdownButton
                            variant="success"
                            disabled={isLoading}
                            title="Download ⬇"
                            id="input-group-dropdown-1"
                        >
                            <Dropdown.Item disabled={isLoading}
                                           onClick={(event) => handleDownload(event, 'csv')}>CSV</Dropdown.Item>
                            <Dropdown.Item disabled={isLoading}
                                           onClick={(event) => handleDownload(event, 'excel')}>Excel</Dropdown.Item>
                        </DropdownButton>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Drop data</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure you want to drop data?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Drop data 🗑
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                ) : null}
            </Form>
            {
                fileList?.files ? (
                        <div className={"overflow-auto mh-20"}>
                            <Table bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>File name</th>
                                    <th>Uploaded at</th>
                                    <th>Rows uploaded</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    fileList.files.map((file, index) => (
                                        <tr key={data_input_type + "tr" + index}>
                                            <td>{file.id}</td>
                                            <td>{file.name}</td>
                                            <td>{file.uploaded_at}</td>
                                            <td>{file.rows_count}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                        </div>
                    ) :
                    (<BlockPlaceholder>You haven't uploaded any files yet 👀</BlockPlaceholder>)
            }
        </>
    )
}

export default FileImportForm;