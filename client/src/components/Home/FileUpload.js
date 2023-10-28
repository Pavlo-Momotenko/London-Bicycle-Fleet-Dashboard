import React from "react";

import Form from "react-bootstrap/Form";
import {Button, Table} from "react-bootstrap";

import "./FileUpload.css";

import BlockPlaceholder from "../BlockPlaceholder";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import DropDataButton from "./DropDataButton";
import DownloadDataButton from "./DownloadDataButton";
import LoadingPlaceholder from "../LoadingPlaceholder";


class FileUpload extends React.Component {
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

    makeHTTPRequest = (method, url, prefetch_states = {}, body = null) => {
        const urlGroup = this.props.urlGroup;
        this.setState(
            {isLoading: true, ...prefetch_states},
            async function () {
                const response = await fetch(
                    url,
                    {
                        method: method,
                        body: body
                    }
                );

                const data = await response.json();

                if (response.status === 200) {
                    if (url === urlGroup.logs) {
                        this.setState({uploadedFilesList: data, isLoading: false});
                    } else {
                        this.setState({successMessage: data?.message, errorMessageList: data?.errors, isLoading: false});
                        this.makeHTTPRequest('GET', urlGroup.logs);
                    }
                } else {
                    this.setState({errorMessageList: data?.message, isLoading: false});
                }
            }
        );
    }

    handleDeleteData = (event) => {
        event.preventDefault();
        const urlGroup = this.props.urlGroup;

        this.makeHTTPRequest('DELETE', urlGroup.root, {errorMessageList: null, successMessage: null});
    }

    handlePostData = (event) => {
        event.preventDefault();
        let formData = new FormData(),
            selectedFile = this.state.selectedFile,
            urlGroup = this.props.urlGroup;

        formData.append('file', selectedFile);
        formData.append('file_name', selectedFile?.name);

        this.makeHTTPRequest('POST', urlGroup.root, {errorMessageList: null, successMessage: null}, formData);
    }

    handleSelectedFileChange = (event) => {
        this.setState({selectedFile: event.target.files[0]})
    }

    componentDidMount() {
        // handleGetData
        const urlGroup = this.props.urlGroup;
        this.makeHTTPRequest('GET', urlGroup.logs);
    }

    handleSetState = (state, callback = () => undefined) => {
        // This method will be used for handling state changes from child components
        this.setState(
            state,
            callback
        );
    }

    render() {
        let urlGroup = this.props.urlGroup,
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
                {errorMessageList?.length > 0 && <ErrorAlert errorMessageList={errorMessageList}/>}
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
                        uploadedFilesList?.length > 0 && (
                            <>
                                <DropDataButton handleDeleteData={handleDeleteData} isLoading={isLoading}/>
                                <DownloadDataButton handleSetState={handleSetState} isLoading={isLoading} url={urlGroup.export}/>
                            </>
                        )
                    }
                </Form>
                {
                    isLoading
                        ? <LoadingPlaceholder/>
                        : (
                            uploadedFilesList?.length > 0
                                ? (
                                    <div className={"overflow-auto max-h-20"}>
                                        <Table bordered hover>
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>File name</th>
                                                <th>Uploaded on</th>
                                                <th>Rows processed</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                uploadedFilesList?.map((file, i) => (
                                                    <tr key={i}>
                                                        <td>{file.id}</td>
                                                        <td>{file.name}</td>
                                                        <td>{file.uploadedAt}</td>
                                                        <td>{file.rowsCount}</td>
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

export default FileUpload;