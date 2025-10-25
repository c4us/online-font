import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Badge,
  Spinner,
  Row,
  Col,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import Header from "../components/Header";

const AjouterCategorie = () => {
  const { id } = useParams(); // codeStructure
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [nameCat, setNameCat] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const navigate = useNavigate();

  // 🔹 Charger les catégories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/category/structure/${id}`,
        { withCredentials: true }
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      setError("Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Supprimer une catégorie
  const handleDelete = async (categoryId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/category/${categoryId}`, {
        withCredentials: true,
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("Impossible de supprimer la catégorie.");
    }
  };

  // 🔹 Modifier une catégorie
  const handleEdit = (cat) => {
    setNameCat(cat.nameCat);
    setDescription(cat.description || "");
    setShowModal(true);
    setEditingCategoryId(cat.id);
  };

  // 🔹 Activer / désactiver une catégorie
  const handleToggle = async (categoryId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/category/updateStatus/${categoryId}`,
        { active: newStatus },
        { withCredentials: true }
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, active: newStatus } : cat
        )
      );
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
      alert("Impossible de changer le statut de la catégorie.");
    }
  };

  // 🔹 Charger au montage
  useEffect(() => {
    fetchCategories();
  }, [id]);

  // 🔹 Ajouter ou modifier une catégorie
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryData = {
        nameCat,
        description,
        codeStructure: id,
      };

      if (editingCategoryId) {
        await axios.put(
          `http://localhost:8080/category/${editingCategoryId}`,
          categoryData,
          { withCredentials: true }
        );
      } else {
        await axios.post("http://localhost:8080/category", categoryData, {
          withCredentials: true,
        });
      }

      setNameCat("");
      setDescription("");
      setShowModal(false);
      setEditingCategoryId(null);
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de l’ajout/modification :", error);
      alert("Erreur lors de la sauvegarde de la catégorie.");
    }
  };

  return (
    <>
      <Header />

      <Container className="mt-5 pt-5 mb-5">
        <h3 className="mb-4 text-center">Catégories de la structure #{id}</h3>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : categories.length === 0 ? (
          <Alert variant="info">
            Aucune catégorie trouvée pour cette structure.
          </Alert>
        ) : (
          <Row xs={1} sm={2} md={2} lg={3} className="g-4">
            {categories.map((cat) => (
              <Col key={cat.id}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="mb-2 d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{cat.nameCat}</strong>
                        <Badge
                          bg="info"
                          text="dark"
                          className="ms-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/produits/${cat.id}`)}
                        >
                          {cat.productCount ?? 0}{" "}
                          {cat.productCount <= 1 ? "produit" : "produits"}
                        </Badge>
                      </div>

                      <Form>
                        <Form.Check
                          type="switch"
                          id={`switch-${cat.id}`}
                          label={cat.active ? "Active" : "Inactive"}
                          checked={!!cat.active}
                          onChange={(e) =>
                            handleToggle(cat.id, e.target.checked)
                          }
                        />
                      </Form>
                    </Card.Title>

                    <Card.Text>
                      {cat.description || "Aucune description"}
                    </Card.Text>

                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(cat)}
                      >
                        ✏️ Modifier
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                      >
                        🗑️ Supprimer
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* 🛒 Bouton flottant : Voir tous les produits */}
        <Button
          variant="success"
          className="rounded-circle shadow-lg"
          style={{
            position: "fixed",
            bottom: "120px",
            right: "40px",
            width: "60px",
            height: "60px",
            fontSize: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
          onClick={() => navigate(`/produits/structure/${id}`)}
          title="Afficher tous les produits"
        >
          🛒
        </Button>

        {/* ➕ Bouton flottant : Ajouter une catégorie */}
        <Button
          variant="primary"
          className="rounded-circle shadow-lg"
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            width: "60px",
            height: "60px",
            fontSize: "28px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
          onClick={() => setShowModal(true)}
          title="Ajouter une catégorie"
        >
          +
        </Button>

        {/* 💬 Modal d’ajout / modification */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCategoryId ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nom de la catégorie</Form.Label>
                <Form.Control
                  type="text"
                  value={nameCat}
                  onChange={(e) => setNameCat(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                {editingCategoryId ? "Enregistrer" : "Ajouter"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default AjouterCategorie;
