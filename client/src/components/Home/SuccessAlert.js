import React from 'react';

import {Alert} from "react-bootstrap";


class SuccessAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let message = this.props.message;

        return (
            <Alert variant={"success"}>
                ✅ {message}
            </Alert>
        );
    }
}

export default SuccessAlert;