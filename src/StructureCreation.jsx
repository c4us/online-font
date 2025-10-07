import React, { useState } from "react";
import axios from 'axios';

// Si vous utilisez 'react-bootstrap', importez-le comme ceci:
// import { Form, Row, Col, Button } from 'react-bootstrap';

// État initial de tous les champs du formulaire (inchangé)
const initialFormData = {
  
  nomStructure: "",
  phone1Structure: "",
  phone2Structure: "",
  paysStructure: "",
  villeStructure: "",
  rueStructure: "",
  codePoste: "",
  structPhotoUrl: "",
  emailStructure: "",
  codeStructure: "",
  typeStructure: "",
  disponibiliteStructure: "disponible",
  isActive: "true",
};

const testMessage ='Le tests est ok';

function StructureFormBootstrap() {
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState(testMessage);


  // Fonction de gestion de changement (inchangée)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Gestion spécifique pour la case à cocher 'isActive'


  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setMessage('Envoi en cours...');
    //console.log(formData)

    try {
      const response = await axios.post(
        'http://127.0.0.1:8080/structure/', // L'URL de votre microservice
        formData
      );

      // Si la requête est un succès (statut 2xx)
      setMessage(`Succès : ${response.data}`); 
      // Réinitialiser le formulaire si besoin : setFormData({ champ1: '', champ2: '' });
    } catch (error) {
      // Gérer les erreurs (réseau, statut HTTP 4xx/5xx)
      console.error('Erreur lors de l\'envoi des données :', error);
      setMessage(`Erreur lors de l'envoi : ${error.message || 'Vérifiez la console.'}`);
    }
  };

  // Fonction de gestion de soumission (inchangée)
  /* const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données du formulaire soumises :", formData);
    alert("Formulaire soumis ! Vérifiez la console.");
  }; */

  // Le conteneur 'container' et 'row' permettent de centrer et d'utiliser la grille
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Creation de votre bussiness en ligne</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* --- Section Informations de Base --- */}
                <h5 className="mb-3 text-primary">Informations de Base</h5>
                <div className="row">
                  {/* Nom et Email (sur la même ligne) */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nomStructure" className="form-label">
                      Nom de la structure *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nomStructure"
                      name="nomStructure"
                      value={formData.nomStructure}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="emailStructure" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailStructure"
                      name="emailStructure"
                      value={formData.emailStructure}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Téléphone 1 et Téléphone 2 */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone1Structure" className="form-label">
                      Téléphone 1
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone1Structure"
                      name="phone1Structure"
                      value={formData.phone1Structure}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone2Structure" className="form-label">
                      Téléphone 2
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone2Structure"
                      name="phone2Structure"
                      value={formData.phone2Structure}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                    <label htmlFor="typeStructure" className="form-label">
                      Domaine
                    </label>
                    <select
                      className="form-select"
                      id="typeStructure"
                      name="typeStructure"
                      value={formData.typeStructure}
                      onChange={handleChange}
                    >
                      <option value="">-- Choisir un type --</option>
                      <option value="hopital">Restauration</option>
                      <option value="clinique">Boutique</option>
                      <option value="laboratoire">Divers</option>
                      <option value="autre">Maki</option>
                    </select>
                  </div>

                </div>

                {/* --- Section Adresse --- */}
                <h5 className="mb-3 mt-4 text-primary">Adresse</h5>
                <div className="row">
                  {/* Pays et Ville */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="paysStructure" className="form-label">
                      Pays
                    </label>
                    <select
                      className="form-select"
                      id="paysStructure"
                      name="paysStructure"
                      value={formData.paysStructure}
                      onChange={handleChange}
                    >
                      <option value="">-- Choisir un type --</option>
                      <option value="BF">BURKINA FASO</option>
                      
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="villeStructure" className="form-label">
                      Ville
                    </label>
                    <select
                      className="form-select"
                      id="villeStructure"
                      name="villeStructure"
                      value={formData.villeStructure}
                      onChange={handleChange}
                    >
                      <option value="">-- Choisir un type --</option>
                      <option value="BF">Ouagadougou</option>
                      <option value="BF">Bobo</option>
                      
                    </select>
                  </div>
                </div>

                {/* Rue et Code Postal */}
                <div className="row">
                  <div className="col-md-9 mb-3">
                    <label htmlFor="rueStructure" className="form-label">
                      Rue/Adresse complète
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="rueStructure"
                      name="rueStructure"
                      value={formData.rueStructure}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="codePoste" className="form-label">
                      Code Postal
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="codePoste"
                      name="codePoste"
                      value={formData.codePoste}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* --- Section Paramètres --- */}
                <h5 className="mb-3 mt-4 text-primary">Photo/Logo</h5>
       
                <div className="row align-items-end">
                

             
                </div>

                {/* Champ structPhotoUrl */}
                <div className="mb-3">
                  <label htmlFor="structPhotoUrl" className="form-label">
                    Selectionner la photo ou le logo de votre entreprise
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="structPhotoUrl"
                    name="structPhotoUrl"
                    value={formData.structPhotoUrl}
                    onChange={handleChange}
                  />
                </div>

                {/* Bouton de soumission */}
                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Enregistrer la Structure
                  </button>
                </div>

                {/* Champ idStructure caché */}
                <input
                  type="hidden"
                  name="idStructure"
                  value={formData.idStructure}
                />
              </form>
                    {message && <p>{message}</p>}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StructureFormBootstrap;
