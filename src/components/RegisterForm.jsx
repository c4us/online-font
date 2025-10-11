import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { registerUser } from "../api/userService";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [user, setUser] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification de la correspondance du mot de passe
    if (user.userPassword !== user.confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas !");
      return;
    }

    setError(""); // Réinitialiser l’erreur avant envoi

    try {
      await registerUser({
        userName: user.userName,
        userEmail: user.userEmail,
        userPhone: user.userPhone,
        userPassword: user.userPassword,
      });

      navigate("/check-email");
     
    } catch (error) {
      alert("❌ Erreur lors de l’enregistrement !");
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "32rem" }} className="p-4 shadow-sm">
        <h3 className="text-center mb-4">Créer un compte</h3>

        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Nom d’utilisateur</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              placeholder="Ex: Jean Dupont"
              value={user.userName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adresse e-mail</Form.Label>
            <Form.Control
              type="email"
              name="userEmail"
              placeholder="Ex: jean@example.com"
              value={user.userEmail}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="text"
              name="userPhone"
              placeholder="+33 6 12 34 56 78"
              value={user.userPhone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="userPassword"
              placeholder="********"
              value={user.userPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirmer le mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={user.confirmPassword}
              onChange={handleChange}
              required
              isInvalid={
                user.confirmPassword.length > 0 &&
                user.userPassword !== user.confirmPassword
              }
            />
            <Form.Control.Feedback type="invalid">
              Les mots de passe ne correspondent pas.
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            S’inscrire
          </Button>
        </Form>

        <div className="text-center mt-3 text-muted-small">
          En créant un compte, vous acceptez nos{" "}
          <a href="/" className="text-decoration-none">
            conditions d’utilisation
          </a>
          .
        </div>
      </Card>
    </div>
  );
};

export default RegisterForm;
