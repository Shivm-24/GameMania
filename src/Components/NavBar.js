import Container from "react-bootstrap/Container";
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function BasicExample({ setPage }) {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>Game Mania</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link onClick={() => setPage("home")}>
            Home
          </Nav.Link>

          <Nav.Link onClick={() => setPage("features")}>
            Features
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default BasicExample;