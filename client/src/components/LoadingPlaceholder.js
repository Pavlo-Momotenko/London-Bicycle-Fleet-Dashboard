import React from 'react';

import {Placeholder} from "react-bootstrap";

import './LoadingPlaceholder.css';


class LoadingPlaceholder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Placeholder as="p" animation="glow">
                <Placeholder className={"w-100 c-default min-h-5"} />
            </Placeholder>
        );
    }
}

export default LoadingPlaceholder;