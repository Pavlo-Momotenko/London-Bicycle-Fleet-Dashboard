import React from 'react';

import {Accordion, Alert} from "react-bootstrap";

import "./ErrorAlert.css";


class ErrorAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let errorMessageList = this.props.errorMessageList;

        if (!Array.isArray(errorMessageList)) {
            return (
                <Alert variant={"danger"}>
                    🚫 {errorMessageList}
                </Alert>
            );
        }

        return (
            <Accordion className={"mb-3"}>
                <Accordion.Item eventKey={"0"}>
                    <Accordion.Header>Some error occurred❗️</Accordion.Header>
                    <Accordion.Body className={"overflow-auto max-h-10"}>
                        {
                            errorMessageList.map((error_message, i) => (
                                <p key={i}>🚫 {error_message}</p>
                            ))
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    }
}

export default ErrorAlert;