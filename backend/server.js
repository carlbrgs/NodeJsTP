const express = require("express");
const mariadb = require('mariadb');
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser =  require('body-parser');



app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


require('dotenv').config();


//connexion BDD 
const con = mariadb.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DTB,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: 3307,
    connectionLimit: 100,
});


// Inscription
app.post('/newUser', async (req, res) => {
    let conn;

    try {
        const hash = await bcrypt.hash(req.body.Mdp, 10);

        console.log("Lancement de la connexion");
        conn = await con.getConnection();
        
        console.log("Lancement de la requête insert");
        console.log(req.body);
        const requete = 'INSERT INTO utilisateur(Nom, Prenom, Email, Mdp) VALUES (?, ?, ?, ?)';
        await conn.query(requete, [req.body.Nom, req.body.Prenom, req.body.Email, hash]);

        console.log("Insertion réussie");
        res.status(200).json({ message: 'Insertion réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

//Connexion

app.post('/connexion', async (req, res) => {

    console.log("Lancement de la connexion");
    const conn = await con.getConnection();

    const { Email, Mdp } =  req.body;

    const query = `SELECT * FROM utilisateur WHERE email = '${Email}'`;

    const login = await conn.query(query);
    if(login.length === 0 ) {
        console.log("mot de passe incrorrect ")
        return res.status(401).json({message : 'Email est invalide '})
    }
    console.log(`mdp entré: ${Mdp}\nmdp stocké: ${login[0].mdp}`)
    const match = await bcrypt.compare(Mdp, login[0].mdp);

    if(!match){
        console.log('incorrect')
        return res.status(401).json({ message: 'Email ou mot de passe sont invalide ' });
      }
      console.log('c bon')
      const indentifiant = {'id':login[0].id,'Email':login[0].Email}
      res.status(200).json(indentifiant);
})



//supprimer un commentaire 

//ajouter un commentaire 

//Modifier un commentaire 



app.delete('/utilisateurs/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      console.log("Lancement de la connexion");
      const conn = await con.getConnection();
  
      // Vérifier si l'utilisateur existe
      const [existingUser] = await conn.query('SELECT * FROM utilisateur WHERE id = ?', [userId]);
      if (existingUser.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
  
      // Supprimer l'utilisateur de la base de données
      await conn.query('DELETE FROM utilisateur WHERE id = ?', [userId]);
  
      console.log("Suppression réussie");
      res.status(200).json({ message: 'Suppression réussie.' });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });
  
  // Modifier un utilisateur
  app.put('/utilisateurs/:id', async (req, res) => {
    const userId = req.params.id;
    const { nom, prenom, email, mdp } = req.body;
  
    try {
      console.log("Lancement de la connexion");
      const conn = await con.getConnection();
  
      // Vérifier si l'utilisateur existe
      const [existingUser] = await conn.query('SELECT * FROM utilisateur WHERE id = ?', [userId]);
      if (existingUser.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
  
      // Hacher le nouveau mot de passe s'il est fourni
      let hashedPassword;
      if (mdp) {
        hashedPassword = await hashPassword(mdp);
      }
  
      // Mettre à jour les informations de l'utilisateur
      await conn.query(
        'UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, mdp = ? WHERE id = ?',
        [nom, prenom, email, hashedPassword, userId]
      );
  
      console.log("Modification réussie");
      res.status(200).json({ message: 'Modification réussie.' });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });
  
  // Ajouter un commentaire
  app.post('/commentaires', async (req, res) => {
    const { contenu_commentaire, utilisateur_id, technologie_id } = req.body;
  
    try {
      console.log("Lancement de la connexion");
      let conn = await con.getConnection();
  
      // Insérer le commentaire dans la base de données
      await conn.query(
        'INSERT INTO commentaire (contenu_commentaire, date_creation_commentaire, utilisateur_id, technologie_id) VALUES (?, NOW(), ?, ?)',
        [contenu_commentaire, utilisateur_id, technologie_id]
      );
  
      console.log("Commentaire ajouté avec succès");
      res.status(200).json({ message: 'Commentaire ajouté avec succès.' });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });
  
  // Modifier un commentaire
  app.put('/commentaires/:id', async (req, res) => {
    const commentaireId = req.params.id;
    const { contenu_commentaire } = req.body;
  
    try {
      console.log("Lancement de la connexion");
      const conn = await con.getConnection();
  
      // Vérifier si le commentaire existe
      const [existingComment] = await conn.query('SELECT * FROM commentaire WHERE id = ?', [commentaireId]);
      if (existingComment.length === 0) {
        return res.status(404).json({ message: 'Commentaire non trouvé.' });
      }
  
      // Mettre à jour le contenu du commentaire
      await conn.query('UPDATE commentaire SET contenu_commentaire = ? WHERE id = ?', [contenu_commentaire, commentaireId]);
  
      console.log("Modification réussie");
      res.status(200).json({ message: 'Modification réussie.' });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });
  
  // Supprimer un commentaire
  app.delete('/commentaires/:id', async (req, res) => {
    const commentaireId = req.params.id;
  
    try {
      console.log("Lancement de la connexion");
      const conn = await con.getConnection();
  
      // Vérifier si le commentaire existe
      const [existingComment] = await conn.query('SELECT * FROM commentaire WHERE id = ?', [commentaireId]);
      if (existingComment.length === 0) {
        return res.status(404).json({ message: 'Commentaire non trouvé.' });
      }
  
      // Supprimer le commentaire de la base de données
      await conn.query('DELETE FROM commentaire WHERE id = ?', [commentaireId]);
  
      console.log("Suppression réussie");
      res.status(200).json({ message: 'Suppression réussie.' });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });



app.listen(3001, () => {
    console.log("Serveur à l'écoute sur le port 3001");
});
