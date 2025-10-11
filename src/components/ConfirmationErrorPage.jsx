import React, { useState } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmationErrorPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/user/resend-confirmation", {
        email,
      });
      setMessage(response.data);
    } catch (err) {
      setError(
        err.response?.data || "Erreur lors de l’envoi du mail de confirmation."
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm text-center" style={{ width: "28rem" }}>
        <h3 className="mb-3 text-danger">❌ Lien invalide ou expiré</h3>
        <p>
          Le lien de confirmation que vous avez utilisé n’est plus valide
          ou a déjà été utilisé...
        </p>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleResend} className="text-start">
          <Form.Group className="mb-3">
            <Form.Label>Entrez votre adresse e-mail pour recevoir un nouveau lien :</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ex: jean@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            🔁 Renvoyer le mail de confirmation
          </Button>
        </Form>

        <Button
          variant="link"
          className="mt-3 text-decoration-none"
          onClick={() => navigate("/login")}
        >
          Retour à la connexion
        </Button>
      </Card>
    </div>
  );
};

export default ConfirmationErrorPage;
