import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/user/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand
          className="fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Tableau de bord
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Navbar.Text className="me-3">
              👤 Connecté en tant que :{" "}
              <strong>{user?.userName || "Utilisateur"}</strong>
            </Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
