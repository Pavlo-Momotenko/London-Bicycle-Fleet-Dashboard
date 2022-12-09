import React from 'react';


class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <h1 style={{fontSize: "15em"}} className={"text-center"}>404</h1>
                <h2 style={{fontSize: "5em"}} className={"text-center"}>Page not found ¯\_(ツ)_/¯</h2>
            </>
        );
    }
}

export default NotFound;