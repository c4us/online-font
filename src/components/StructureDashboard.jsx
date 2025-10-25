import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Navbar,
  Container,
  Nav,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // ✅ Import du header


const StructureDashboard = () => {
  const navigate = useNavigate();
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchStructures = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/structure/user/${user.id}`,
          { withCredentials: true }
        );
        setStructures(res.data);
      } catch (err) {
        setError("Erreur lors du chargement des structures");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStructures();
  }, [navigate, user]);



  // 👉 Fonction appelée lorsqu'on clique sur une image
  const handleImageClick = (idStructure) => {
    navigate(`/ajouter-categorie/${idStructure}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  const defaultImage = "https://via.placeholder.com/400x250?text=Aucune+image";

  return (
    <>
      {/* --- Header --- */}
     

      {/* --- Contenu principal --- */}
      <div className="container py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Mes business</h3>
          <Button variant="success" onClick={() => navigate("/structure-create")}>
            + Nouvelle structure
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {structures.length === 0 ? (
          <Alert variant="info">
            Aucun business trouvé. Créez-en un nouveau !
          </Alert>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {structures.map((structure) => (
              <Col key={structure.idStructure}>
                <Card className="h-100 shadow-sm border-0">
                  {/* 👉 CLIC SUR L’IMAGE = REDIRECTION */}
                  <Card.Img
                    variant="top"
                    src={structure.structPhotoUrl || defaultImage}
                    alt={structure.nomStructure}
                    onClick={() => handleImageClick(structure.idStructure)} // <--- ajout ici
                    style={{
                      height: "200px",
                      width: "100%",
                      objectFit: "contain",
                      display: "block",
                      backgroundColor: "#f8f9fa",
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.03)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                  <Card.Body>
                    <Card.Title className="text-primary fw-bold mb-3">
                      {structure.nomStructure}
                    </Card.Title>
                    <Card.Text>
                      <strong>Ville :</strong> {structure.villeStructure} <br />
                      <strong>Type :</strong> {structure.typeStructure} <br />
                      <strong>Disponibilité :</strong>{" "}
                      {structure.disponibiliteStructure
                        ? "Disponible ✅"
                        : "Indisponible ❌"}{" "}
                      <br />
                      <strong>Créé le :</strong>{" "}
                      {new Date(structure.createdDate).toLocaleDateString()}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/structure/${structure.idStructure}`)
                        }
                      >
                        Voir détails
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          navigate(`/structure-edit/${structure.idStructure}`)
                        }
                      >
                        Modifier
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
};

export default StructureDashboard;
