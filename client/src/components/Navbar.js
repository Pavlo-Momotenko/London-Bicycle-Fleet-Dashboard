import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, useMatch, useResolvedPath} from 'react-router-dom';
import './Navbar.css';

export default function NavbarComponent() {
    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand to="/" as={Link}>📈<span
                    className="navbar-brand-title">London Bicycle Fleet Data</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavbarLink to="/data-visualization">Data Visualization</NavbarLink>
                        <NavbarLink to="/data-analysis">Data Analysis</NavbarLink>
                    </Nav>
                    <Link to={"/readme"} className={"btn btn-primary"}>README 📄</Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function NavbarLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path: resolvedPath.pathname, end: true});

    return <Nav.Link to={to} {...props} active={isActive} as={Link}>{children}</Nav.Link>
}