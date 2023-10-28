import React from 'react';

import {Button, Modal} from "react-bootstrap";


class DropDataButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalShown: false,
        };
    }

    render() {
        let isLoading = this.props.isLoading,
            handleDeleteData = this.props.handleDeleteData,
            isModalShown = this.state.isModalShown;

        return (
            <>
                <Button
                    variant={"danger"} disabled={isLoading} className={"mx-3"}
                    onClick={() => this.setState({isModalShown: true})}
                >
                    Delete 🗑
                </Button>
                <Modal show={isModalShown} onHide={() => this.setState({isModalShown: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You want to delete data. Are you sure?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({isModalShown: false})}>
                            Cancel
                        </Button>
                        <Button variant="danger"
                                onClick={
                                    (event) => this.setState({isModalShown: false}, handleDeleteData(event))
                                }
                        >
                            Delete 🗑
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default DropDataButton;