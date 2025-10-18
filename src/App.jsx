import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TermsScreen from "./components/TermsScreen";
import RegisterForm from "./components/RegisterForm";
import "bootstrap/dist/css/bootstrap.min.css";
import CheckEmailScreen from "./components/CheckEmailScreen";
import ConfirmationErrorPage from "./components/ConfirmationErrorPage";
import LoginPage from "./components/LoginPage";
import ConfirmationSuccessPage from "./components/ConfirmationSuccessPage";

import "./App.css";
import CategoryPage from "./components/CategoriesCreatePage";
import StructureCreatePage from "./components/StructureCreatePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="terms" element={<TermsScreen />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/check-email" element={<CheckEmailScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/confirmation-error"
          element={<h3>❌ Lien de confirmation invalide</h3>}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirmation-error" element={<ConfirmationErrorPage />} />
        <Route path="/confirmation-success" element={<ConfirmationSuccessPage />} />
        <Route path="/structure-create" element={<StructureCreatePage />} />
        


      </Routes>
    </Router>
  );
}

export default App;
