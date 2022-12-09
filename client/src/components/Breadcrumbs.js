import React from 'react';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import {Link} from "react-router-dom";


class BreadcrumbComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let currentPageTitle = this.props.children;

        return (
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{to: "/"}}>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>{currentPageTitle}</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}

export default BreadcrumbComponent;