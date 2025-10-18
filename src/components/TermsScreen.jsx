import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (accepted) {
      navigate("/register"); // étape suivante
    } else {
      alert("Vous devez accepter les conditions générales pour continuer.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm" style={{ width: "28rem" }}>
        <h3 className="text-center mb-4">Conditions Générales</h3>

        <div className="mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
          <p>
            {/* Exemple de texte CGU */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="J'accepte les conditions générales"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
        </Form.Group>

        <Button variant="primary" className="w-100" onClick={handleNext}>
          Continuer
        </Button>
      </Card>
    </div>
  );
};

export default TermsPage;
