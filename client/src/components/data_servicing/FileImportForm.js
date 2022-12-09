import React from "react";

import Form from "react-bootstrap/Form";
import {Button, Table} from "react-bootstrap";

import "./FileImportForm.css";

import BlockPlaceholder from "../BlockPlaceholder";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import DropDataButton from "./DropDataButton";
import DownloadDataButton from "./DownloadDataButton";
import LoadingPlaceholder from "../LoadingPlaceholder";


class FileImportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,

            // Files related states
            uploadedFilesList: null,
            errorMessageList: null,
            successMessage: null,
            selectedFile: null
        };
    }

    makeHTTPRequest = (method, prefetch_states = {}, body = null) => {
        let url = this.props.url;

        this.setState(
            {isLoading: true, ...prefetch_states},
            async function () {
                const response = await fetch(
                    "/api/upload/" + url,
                    {
                        method: method,
                        body: body
                    }
                );

                const data = await response.json();

                if (response.status === 200 && typeof data === 'string') {
                    this.setState({successMessage: data, isLoading: false});
                    // We do update of the uploaded files table only in case of success file uploading (POST -> 201)
                    this.makeHTTPRequest('GET');
                } else if (response.status === 200) {
                    this.setState({uploadedFilesList: data, isLoading: false});
                } else {
                    this.setState({errorMessageList: data, isLoading: false});
                }
            }
        );
    }

    handleDeleteData = (event) => {
        event.preventDefault();

        this.makeHTTPRequest('DELETE', {errorMessageList: null, successMessage: null});
    }

    handlePostData = (event) => {
        event.preventDefault();
        let formData = new FormData(),
            selectedFile = this.state.selectedFile;

        formData.append('file', selectedFile);
        formData.append('file_name', selectedFile?.name);

        this.makeHTTPRequest('POST', {errorMessageList: null, successMessage: null}, formData);
    }

    handleSelectedFileChange = (event) => {
        this.setState({selectedFile: event.target.files[0]})
    }

    componentDidMount() {
        // handleGetData
        this.makeHTTPRequest('GET');
    }

    handleSetState = (state, callback = () => undefined) => {
        // This method will be used for handling state changes from child components
        this.setState(
            state,
            callback
        );
    }

    render() {
        let url = this.props.url,
            isLoading = this.state.isLoading,
            uploadedFilesList = this.state.uploadedFilesList,
            successMessage = this.state.successMessage,
            errorMessageList = this.state.errorMessageList,
            handlePostData = this.handlePostData,
            handleDeleteData = this.handleDeleteData,
            handleSelectedFileChange = this.handleSelectedFileChange,
            handleSetState = this.handleSetState;

        return (
            <>
                {successMessage && <SuccessAlert message={successMessage}/>}
                {errorMessageList && <ErrorAlert errorMessageList={errorMessageList}/>}
                <Form onSubmit={handlePostData}
                      className={"mb-3 d-flex justify-content-between align-content-center flex-nowrap"}
                >
                    <Form.Group controlId="formBicycleStationsFile" className={"flex-sm-fill me-3"}>
                        <Form.Control
                            type="file" disabled={isLoading} accept=".csv,.xlsx" onChange={handleSelectedFileChange}
                            required={true}
                        />
                    </Form.Group>
                    <Button type={"submit"} disabled={isLoading}>Upload data ⬆️</Button>
                    {
                        uploadedFilesList && (
                            <>
                                <DropDataButton handleDeleteData={handleDeleteData} isLoading={isLoading}/>
                                <DownloadDataButton handleSetState={handleSetState} isLoading={isLoading} url={url}/>
                            </>
                        )
                    }
                </Form>
                {
                    isLoading
                        ? <LoadingPlaceholder/>
                        : (
                            uploadedFilesList
                                ? (
                                    <div className={"overflow-auto max-h-20"}>
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
                                                uploadedFilesList?.map((file, i) => (
                                                    <tr key={i}>
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
                                )
                                : <BlockPlaceholder>You haven't uploaded any files yet 👀</BlockPlaceholder>
                        )
                }
            </>
        );
    }
}

export default FileImportForm;