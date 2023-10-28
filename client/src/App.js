import React from 'react';

import {Route, Routes} from "react-router-dom";
import Container from "react-bootstrap/Container";

import NavbarComponent from "./components/Navbar";

import DataVisualization from "./pages/DataVisualization";
import DataAnalysis from "./pages/DataAnalysis";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Readme from "./pages/Readme";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <NavbarComponent/>
                <Container className={"my-5"} as={"main"}>
                    <Routes>
                        <Route path={'/'} element={<Home/>}/>
                        <Route path={'/data-visualization'} element={<DataVisualization/>}/>
                        <Route path={'/data-analysis'} element={<DataAnalysis/>}/>
                        <Route path={'/readme'} element={<Readme/>}></Route>
                        <Route path={'*'} element={<NotFound/>}/>
                    </Routes>
                </Container>
            </>
        );
    }
}

export default App;
