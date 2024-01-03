import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const Commentaires = () => {
  const [commentaires, setCommentaires] = useState([]);
  const [nouveauCommentaire, setNouveauCommentaire] = useState({ contenu_commentaire: '', utilisateur_id: 1, technologie_id: 1 });
  const [commentaireModifie, setCommentaireModifie] = useState({ id: null, contenu_commentaire: '' });

  useEffect(() => {
    // Charger les commentaires au chargement du composant
    chargerCommentaires();
  }, []);

  const chargerCommentaires = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/commentaires');
      setCommentaires(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const ajouterCommentaire = async () => {
    try {
      const response = await Axios.post('http://localhost:3001/commentaires', nouveauCommentaire);

      if (response.status === 200) {
        alert('Commentaire ajouté avec succès');
        chargerCommentaires();
        // Réinitialiser le formulaire
        setNouveauCommentaire({ contenu_commentaire: '', utilisateur_id: 1, technologie_id: 1 });
      } else {
        alert('Erreur lors de l\'ajout du commentaire');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  const modifierCommentaire = async () => {
    try {
      const response = await Axios.put(`http://localhost:3001/commentaires/${commentaireModifie.id}`, {
        contenu_commentaire: commentaireModifie.contenu_commentaire,
      });

      if (response.status === 200) {
        alert('Commentaire modifié avec succès');
        chargerCommentaires();
        // Réinitialiser le formulaire de modification
        setCommentaireModifie({ id: null, contenu_commentaire: '' });
      } else {
        alert('Erreur lors de la modification du commentaire');
      }
    } catch (error) {
      console.error('Erreur lors de la modification du commentaire:', error);
    }
  };

  const supprimerCommentaire = async (id) => {
    try {
      const response = await Axios.delete(`http://localhost:3001/commentaires/${id}`);

      if (response.status === 200) {
        alert('Commentaire supprimé avec succès');
        chargerCommentaires();
      } else {
        alert('Erreur lors de la suppression du commentaire');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
    }
  };

  return (
    <div>
      <h2>Liste des Commentaires</h2>
      <ul>
        {commentaires.map((commentaire) => (
          <li key={commentaire.id}>
            {commentaire.contenu_commentaire}{' '}
            <button onClick={() => setCommentaireModifie({ id: commentaire.id, contenu_commentaire: commentaire.contenu_commentaire })}>
              Modifier
            </button>
            <button onClick={() => supprimerCommentaire(commentaire.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>Ajouter un Commentaire</h2>
      <div>
        <label>Contenu Commentaire:</label>
        <input
          type="text"
          value={nouveauCommentaire.contenu_commentaire}
          onChange={(e) => setNouveauCommentaire({ ...nouveauCommentaire, contenu_commentaire: e.target.value })}
        />
      </div>
      <button onClick={ajouterCommentaire}>Ajouter Commentaire</button>

      {commentaireModifie.id && (
        <>
          <h2>Modifier un Commentaire</h2>
          <div>
            <label>Contenu Commentaire:</label>
            <input
              type="text"
              value={commentaireModifie.contenu_commentaire}
              onChange={(e) => setCommentaireModifie({ ...commentaireModifie, contenu_commentaire: e.target.value })}
            />
          </div>
          <button onClick={modifierCommentaire}>Modifier Commentaire</button>
        </>
      )}
    </div>
  );
};

export default Commentaires;