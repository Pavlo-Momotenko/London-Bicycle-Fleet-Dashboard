import React from 'react';

import Dropdown from "react-bootstrap/Dropdown";
import {DropdownButton} from "react-bootstrap";

import {saveAs} from 'file-saver';


class DownloadDataButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleGetData = (event, file_extension) => {
        event.preventDefault();

        let url = this.props.url,
            handleSetState = this.props.handleSetState,
            downloadUrl = url.concat("?", new URLSearchParams({as: file_extension}).toString());

        handleSetState(
            {isLoading: true, errorMessageList: null, successMessage: null},
            async function () {
                await fetch(
                    downloadUrl,
                    {
                        method: "GET",
                    }
                ).then(
                    (response) => {
                        return response.blob();
                    }
                ).then(
                    (blob) => {
                        saveAs(blob, `export.${file_extension}`);
                        handleSetState({isLoading: false});
                    }
                );
            }
        );
    }

    render() {
        let isLoading = this.props.isLoading,
            handleGetData = this.handleGetData;

        return (
            <DropdownButton
                variant="success"
                disabled={isLoading}
                title="Download ⬇"
                id="input-group-dropdown-1"
            >
                <Dropdown.Item
                    disabled={isLoading}
                    onClick={(event) => handleGetData(event, 'csv')}
                >
                    CSV
                </Dropdown.Item>
                <Dropdown.Item
                    disabled={isLoading}
                    onClick={(event) => handleGetData(event, 'xlsx')}
                >
                    XLSX
                </Dropdown.Item>
            </DropdownButton>
        );
    }
}

export default DownloadDataButton;