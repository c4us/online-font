import React, { useState } from "react";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/user/login",
        { email, password },
        { withCredentials: true }
      );

      // ✅ Sauvegarde de l'utilisateur connecté (renvoyé par le backend)
      localStorage.setItem("user", JSON.stringify(res.data));
      console.log(res.data);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data || "Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm" style={{ width: "28rem" }}>
        <h3 className="text-center mb-4">Connexion</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Se connecter"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <span>Pas encore de compte ? </span>
          <Button variant="link" onClick={() => navigate("/terms")}>
            Créer un compte
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
