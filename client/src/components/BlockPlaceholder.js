import React from 'react';

import './BlockPlaceholder.css';


class BlockPlaceholder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let placeholderMessage = this.props.children;

        return (
            <div className={"block-placeholder"}>
                <p>{placeholderMessage ? placeholderMessage : "Nothing to display 👀"}</p>
            </div>
        );
    }
}

export default BlockPlaceholder;