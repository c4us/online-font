import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CheckEmailScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm text-center" style={{ width: "28rem" }}>
        <h3 className="mb-3 text-success">🎉 Compte presque prêt !</h3>
        <p>
          Merci pour votre inscription. <br />
          Nous venons de vous envoyer un e-mail de confirmation.
        </p>
        <p className="text-muted">
          Veuillez vérifier votre boîte de réception et cliquer sur le lien pour
          activer votre compte.
        </p>
        <Button variant="primary" className="mt-2" onClick={() => navigate("/")}>
          Retour à l’accueil
        </Button>
      </Card>
    </div>
  );
};

export default CheckEmailScreen;
