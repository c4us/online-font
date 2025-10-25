import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  InputGroup,
  Button,
  Spinner,
  Badge,
  Modal,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { Toast } from "react-bootstrap";


const ProduitsPage = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal + form states
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQte, setProductQte] = useState("");
  const [productPhotoUrl, setProductPhotoUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 🔹 Charger les catégories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/category", {
        withCredentials: true,
      });

      // ✅ Adapte automatiquement au format Spring Data (content) ou tableau direct
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.content)
        ? res.data.content
        : [];

      console.log("📦 Catégories reçues :", data); // 👉 vérifie dans la console

      setCategories(data);
    } catch (err) {
      console.error("❌ Erreur chargement catégories :", err);
      setCategories([]);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/product/${currentProduct.id}`,
        currentProduct,
        { withCredentials: true }
      );
      console.log("Produit à mettre à jour :", currentProduct);

      console.log(res);

      // 🔄 Mets à jour la liste localement
      setProduits((prev) =>
        prev.map((p) => (p.id === currentProduct.id ? currentProduct : p))
      );

      setShowEditModal(false);

      // ✅ Affiche le toast de succès
      setToastMessage(
        `✅ Produit "${currentProduct.productName}" mis à jour avec succès !`
      );
      setShowToast(true);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setToastMessage("❌ Erreur lors de la mise à jour du produit.");
      setShowToast(true);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/product/${currentProduct.id}`, {
        withCredentials: true,
      });

      // 🔄 Mets à jour la liste et le compteur localement
      setProduits((prev) => prev.filter((p) => p.id !== currentProduct.id));

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory
            ? { ...cat, productCount: (cat.productCount || 1) - 1 }
            : cat
        )
      );

      setShowDeleteModal(false);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  // 🔹 Charger les produits
  const fetchProduits = async (categoryId = null) => {
    setLoading(true);
    try {
      const url = categoryId
        ? `http://localhost:8080/product/category/${categoryId}`
        : "http://localhost:8080/product";

      const res = await axios.get(url, { withCredentials: true });

      // ✅ Force l’extraction des produits quel que soit le format du backend
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.content)
        ? res.data.content
        : res.data.products || [];

      setProduits(data);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduits(selectedCategory);
  }, [selectedCategory]);

  // 🔍 Recherche front-end
  const filteredProduits = produits.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Ajouter un produit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Veuillez choisir une catégorie.");
    try {
      const newProduct = {
        productName,
        productPrice: parseFloat(productPrice),
        productQte: parseFloat(productQte),
        productPhotoUrl,
        categoryId: selectedCategory,
      };
      await axios.post("http://localhost:8080/product", newProduct, {
        withCredentials: true,
      });
      fetchCategories();
      setSuccess(true);
      setError(null);
      fetchProduits(selectedCategory);
      setShowModal(false);
      setProductName("");
      setProductPrice("");
      setProductQte("");
      setProductPhotoUrl("");
      // Le message disparaît après 3 secondes
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Erreur ajout produit :", err);
      setError("Impossible d’ajouter le produit.");
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="mt-5 pt-4">
        {success && (
          <Alert
            variant="success"
            className="position-fixed top-0 end-0 m-3 shadow"
            style={{ zIndex: 2000 }}
          >
            ✅ Produit ajouté avec succès !
          </Alert>
        )}

        <Row>
          {/* 🔹 Sidebar Catégories */}
          <Col
            xs={12}
            md={3}
            className="border-end"
            style={{ minHeight: "85vh", backgroundColor: "#f8f9fa" }}
          >
            <h5 className="mt-3 mb-3 text-center">Catégories</h5>
            <ListGroup>
              <ListGroup.Item
                active={!selectedCategory}
                action
                onClick={() => setSelectedCategory(null)}
              >
                🏷️ Toutes les catégories
              </ListGroup.Item>
              {categories.map((cat) => (
                <ListGroup.Item
                  key={cat.id}
                  active={selectedCategory === cat.id}
                  action
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.nameCat}
                  <Badge bg="secondary" className="float-end">
                    {cat.productCount ?? 0}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* 🔹 Liste des produits */}
          <Col xs={12} md={9} className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>
                {selectedCategory
                  ? "Produits de la catégorie"
                  : "Tous les produits"}
              </h4>

              {/* Recherche */}
              <InputGroup style={{ maxWidth: "300px" }}>
                <Form.Control
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">🔍</Button>
              </InputGroup>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" />
              </div>
            ) : filteredProduits.length === 0 ? (
              <p className="text-center text-muted mt-5">
                Aucun produit trouvé.
              </p>
            ) : (
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredProduits.map((prod) => (
                  <Col key={prod.id}>
                    <Card className="h-100 shadow-sm">
                      <Card.Img
                        variant="top"
                        src={prod.productPhotoUrl || "/placeholder.png"}
                        style={{ height: "160px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title>{prod.productName}</Card.Title>
                        <Card.Text className="text-muted small">
                          Prix : {prod.productPrice} €<br />
                          Quantité : {prod.productQte}
                        </Card.Text>
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setCurrentProduct(prod);
                              setShowEditModal(true);
                            }}
                          >
                            ✏️ Modifier
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setCurrentProduct(prod);
                              setShowDeleteModal(true);
                            }}
                          >
                            🗑 Supprimer
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>

        {/* 🔘 Bouton flottant pour ajouter un produit */}
        {selectedCategory && (
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
          >
            +
          </Button>
        )}

        {/* 🧾 Modal d’ajout de produit */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un produit</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAddProduct}>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Nom du produit</Form.Label>
                <Form.Control
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prix (€)</Form.Label>
                <Form.Control
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantité</Form.Label>
                <Form.Control
                  type="number"
                  value={productQte}
                  onChange={(e) => setProductQte(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>URL de la photo</Form.Label>
                <Form.Control
                  type="text"
                  value={productPhotoUrl}
                  onChange={(e) => setProductPhotoUrl(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Ajouter
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Modifier le produit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentProduct && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du produit</Form.Label>
                  <Form.Control
                    value={currentProduct.productName}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        productName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Prix</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentProduct.productPrice}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        productPrice: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Quantité</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentProduct.productQte}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        productQte: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleUpdateProduct}>
              Sauvegarder
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Voulez-vous vraiment supprimer le produit{" "}
            <strong>{currentProduct?.productName}</strong> ?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 1060,
            backgroundColor: "#198754",
            color: "white",
          }}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </Container>
    </>
  );
};

export default ProduitsPage;
