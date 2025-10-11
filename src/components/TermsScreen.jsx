import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TermsScreen = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    if (accepted) navigate("/register");
    else alert("Veuillez accepter les conditions pour continuer.");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "40rem" }} className="p-4">
        <h3 className="text-center mb-3">Conditions d’utilisation</h3>
        <div
          className="border rounded p-3 mb-3 bg-light"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          <p>
            Bienvenue ! Avant de continuer, veuillez lire attentivement nos
            conditions générales d’utilisation. En acceptant, vous reconnaissez
            comprendre et respecter les règles relatives à la confidentialité et
            à l’utilisation de vos données personnelles.
          </p>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="accept"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <label htmlFor="accept" className="form-check-label">
            J’accepte les conditions d’utilisation
          </label>
        </div>
        <Button variant="primary" className="w-100" onClick={handleAccept}>
          Continuer
        </Button>
      </Card>
    </div>
  );
};

export default TermsScreen;
