import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ConfirmationSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 shadow-sm text-center" style={{ width: "28rem" }}>
          <h3 className="text-success mb-3">✅ Compte confirmé avec succès !</h3>
          <p>
            Félicitations 🎉 Votre compte a été activé.  
            Vous pouvez maintenant vous connecter à votre espace utilisateur.
          </p>

          <Button
            variant="primary"
            className="w-100 mt-3"
            onClick={() => navigate("/login")}
          >
            Se connecter maintenant
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfirmationSuccessPage;
