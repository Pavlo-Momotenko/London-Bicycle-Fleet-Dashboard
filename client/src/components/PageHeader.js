import React from 'react';

import BreadcrumbComponent from "./Breadcrumbs";


class PageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let headerTitle = this.props.children;

        return (
            <>
                <h1>{headerTitle}</h1>
                <BreadcrumbComponent>{headerTitle}</BreadcrumbComponent>
            </>
        );
    }
}

export default PageHeader;