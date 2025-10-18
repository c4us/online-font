import React, { useState, useEffect } from "react";
import { Card, Button, Form, Alert, Table, Spinner } from "react-bootstrap";
import axios from "axios";

const CategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Charger les catégories existantes au chargement
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/structure");
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des catégories.");
    }
  };

  // 🔹 Création d’une nouvelle catégorie
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/structure", {
        name: categoryName,
      });

      setMessage("✅ Catégorie créée avec succès !");
      setCategoryName("");
      fetchCategories(); // Rafraîchir la liste
    } catch (err) {
      console.error(err);
      setError("❌ Erreur lors de la création de la catégorie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Gestion des catégories</h2>

      <Card className="p-4 mb-4 shadow-sm">
        <h5 className="mb-3">Créer une nouvelle catégorie</h5>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom de la catégorie</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Électronique"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Ajouter"}
          </Button>
        </Form>
      </Card>

      <Card className="p-4 shadow-sm">
        <h5 className="mb-3">Liste des catégories</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <tr key={cat.id}>
                  <td>{index + 1}</td>
                  <td>{cat.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-muted">
                  Aucune catégorie disponible
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default CategoryPage;
