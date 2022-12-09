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
                    Drop 🗑
                </Button>
                <Modal show={isModalShown} onHide={() => this.setState({isModalShown: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Drop data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to drop data?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({isModalShown: false})}>
                            Cancel
                        </Button>
                        <Button variant="danger"
                                onClick={
                                    (event) => this.setState({isModalShown: false}, handleDeleteData(event))
                                }
                        >
                            Drop 🗑
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default DropDataButton;