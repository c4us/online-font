import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StructureCreatePage = () => {
  const navigate = useNavigate();

  // 🔹 Vérifier que l'utilisateur est connecté
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  const initialStructure = {
    nomStructure: "",
    phone1Structure: "",
    phone2Structure: "",
    paysStructure: "Burkina Faso",
    villeStructure: "",
    rueStructure: "",
    codePoste: "",
    structPhotoUrl: "",
    typeStructure: "",
    disponibiliteStructure: "",
    geoLocStructure: "",
    descriptionStructure: "",
    createdUserId: user?.id || "", // 🔹 ID de l'utilisateur connecté
  };

  const villesBurkina = ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Autre"];

  const [structure, setStructure] = useState(initialStructure);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Gestion des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStructure({ ...structure, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée par votre navigateur");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setStructure({ ...structure, geoLocStructure: `${lat}, ${lon}` });
      },
      () => alert("Impossible de récupérer votre position")
    );
  };

  const handleReset = () => {
    setStructure(initialStructure);
    setPhotoFile(null);
    setPhotoPreview(null);
    setMessage(null);
    setError(null);
  };

  // 🔹 Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1️⃣ Envoi des données de la structure
      const res = await axios.post("http://localhost:8080/structure", structure, {
        withCredentials: true,
      });

      const newStructure = res.data;

      // 2️⃣ Upload de la photo (si présente)
      if (photoFile) {
        const formData = new FormData();
        formData.append("id", newStructure.idStructure);
        formData.append("file", photoFile);

        await axios.put("http://localhost:8080/structure/photo", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 3️⃣ Message + redirection vers dashboard
      setMessage("✅ Structure créée avec succès !");
      setTimeout(() => navigate("/dashboard"), 1500); // Redirection après 1,5s

    } catch (err) {
      console.error("Erreur lors de la création :", err);
      setError("❌ Erreur lors de la création de la structure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start py-5 bg-light">
      <Card className="p-4 shadow-sm" style={{ width: "80%" }}>
        <h3 className="text-center mb-4">Créer mon bussiness en ligne</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Colonne gauche */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom de la structure</Form.Label>
                <Form.Control
                  type="text"
                  name="nomStructure"
                  value={structure.nomStructure}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Téléphone 1</Form.Label>
                <Form.Control
                  type="text"
                  name="phone1Structure"
                  value={structure.phone1Structure}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Téléphone 2</Form.Label>
                <Form.Control
                  type="text"
                  name="phone2Structure"
                  value={structure.phone2Structure}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pays</Form.Label>
                <Form.Select
                  name="paysStructure"
                  value={structure.paysStructure}
                  onChange={handleChange}
                  required
                >
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Autre">Autre</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ville</Form.Label>
                <Form.Select
                  name="villeStructure"
                  value={structure.villeStructure}
                  onChange={handleChange}
                  required
                  disabled={structure.paysStructure !== "Burkina Faso"}
                >
                  <option value="">Sélectionner la ville</option>
                  {villesBurkina.map((ville) => (
                    <option key={ville} value={ville}>
                      {ville}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rue</Form.Label>
                <Form.Control
                  type="text"
                  name="rueStructure"
                  value={structure.rueStructure}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Colonne droite */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Code Postal</Form.Label>
                <Form.Control
                  type="text"
                  name="codePoste"
                  value={structure.codePoste}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type de structure</Form.Label>
                <Form.Select
                  name="typeStructure"
                  value={structure.typeStructure}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Hopital">Hôpital</option>
                  <option value="Clinique">Clinique</option>
                  <option value="Laboratoire">Laboratoire</option>
                  <option value="Autre">Autre</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Disponibilité</Form.Label>
                <Form.Select
                  name="disponibiliteStructure"
                  value={structure.disponibiliteStructure}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Indisponible">Indisponible</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descriptionStructure"
                  value={structure.descriptionStructure}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Géo-localisation</Form.Label>
                <Form.Control
                  type="text"
                  name="geoLocStructure"
                  value={structure.geoLocStructure}
                  onChange={handleChange}
                  placeholder="Ex: 12.3456, 1.2345"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={handleGetLocation}
                >
                  Obtenir ma position
                </Button>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Photo de la structure</Form.Label>
                <Form.Control type="file" onChange={handlePhotoChange} />
                {photoPreview && (
                  <div className="mt-2">
                    <Image src={photoPreview} alt="Aperçu" thumbnail style={{ maxHeight: "150px" }} />
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={handleReset}>
              Annuler
            </Button>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Enregistrer"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default StructureCreatePage;
