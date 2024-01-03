import React, { useState } from 'react';
import Axios from 'axios';

export default function Inscription() {
  const [Nom, setNom] = useState("");
  const [Prenom, setPrenom] = useState("");
  const [Email, setEmail] = useState("");
  const [Mdp, setMdp] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Axios.post("http://localhost:3001/newUser", {
      Nom: Nom,
      Prenom: Prenom,
      Email: Email,
      Mdp: Mdp,
    })
      .then((response) => {
        if (response.data.message) {
          setRegisterStatus(response.data.message);
        } else {
          setRegisterStatus("Votre compte a bien été créé");
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setRegisterStatus("Une erreur s'est produite lors de l'inscription");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4">
        <h5 className="card-title text-center mb-4">Inscription</h5>
        <form>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              name="Nom"
              type="text"
              className="form-control"
              id="nom"
              placeholder="Entrer votre Nom"
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="prenom">Prenom</label>
            <input
              name="Prenom"
              type="text"
              className="form-control"
              id="prenom"
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Adresse Mail</label>
            <input
              name="Email"
              type="email"
              className="form-control"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mdp">Mot de passe</label>
            <input
              name="Mdp"
              type="password"
              className="form-control"
              id="mdp"
              onChange={(e) => setMdp(e.target.value)}
            />
          </div>
          <div className="d-flex flex-column align-items-center">
            <button
              className="btn btn-primary btn-block mb-3"
              type="submit"
              onClick={register}
              disabled={isSubmitting}
            >
              {isSubmitting ? "En cours..." : "Enregistrer"}
            </button>
            <h6 className="text-center mb-3">{registerStatus}</h6>
            <button
              className="btn btn-warning btn-block"
              type="reset"
            >
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
