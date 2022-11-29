import NavbarComponent from "./components/Navbar";
import DataVisualization from "./pages/DataVisualization";
import DataAnalysis from "./pages/DataAnalysis";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import {Route, Routes} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Readme from "./pages/Readme";

function App() {
    return (
        <>
            <NavbarComponent/>
            <Container className={"mt-5"}>
                <Routes>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/data-analysis'} element={<DataAnalysis/>}/>
                    <Route path={'/data-visualization'} element={<DataVisualization/>}/>
                    <Route path={'/readme'} element={<Readme/>}></Route>
                    <Route path={'*'} element={<NotFound/>}/>
                </Routes>
            </Container>
        </>
    );
}

export default App;
