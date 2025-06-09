import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Utilisateur from '../model/Utilisateur/Utilisateur.js';
import ErrorHandler from '../middleware/ErrorHandler.js';

const ControleurUtilisateur = {
  creerUnCompte(req, res, next) { // VERIFIED
    const requete = req.body;
    Utilisateur.creerUtilisateur(requete)
      .then((utilisateur) => {
        // TODO Log create with logger Middleware
        res.status(201).json({
          ApiMessage: req.t("reponses.creer_utilisateur_succes"),
          objet: utilisateur.toJSON(req.t)
        });
      })
      .catch((error) => {
        // TODO Log error with logger Middleware
        next(error);
      });
  },
  connexion(req, res, next) {
    const { nomUtilisateur, motDePasse } = req.body;
    if (!nomUtilisateur || !motDePasse) {
      next(new ErrorHandler.AppError(400, "reponses.connexion_echec", true));
    }

    Utilisateur.obtenirUtilisateurParNom(nomUtilisateur)
      .then((utilisateurTrouver) => {
        if (!utilisateurTrouver) {
          throw new ErrorHandler.AppError(404, "reponses.obtenir_utilisateur_erreur", true);
        }

        // Verification du mot de passe
        // BUG corriger la comparaison du mot de passe
        bcrypt.compare(motDePasse, utilisateurTrouver.motDePasse)
          .then((resultat) => {
            if (!resultat) {
              return next(new ErrorHandler.AppError(401, "reponses.mot_de_passe_invalide", true));
            } else {
              // Generation du access token JWT
              const token = jwt.sign({ "utilisateur": utilisateurTrouver.nomUtilisateur }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });

              // Generation du refresh token JWT. "sign()" retourne un JWToken 
              const refreshToken = jwt.sign({ "utilisateur": utilisateurTrouver.nomUtilisateur }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

              // Sauvegarde du refresh token dans la base de données sur l'utilisateur
              // utilisateurTrouver.refreshToken = refreshToken;
              // utilisateurTrouver.sauvegarder()

              // TODO Verifier dans mon browser si le cookie est bien envoyé
              res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 jour en millisecondes
              });
              res.status(200).json({
                ApiMessage: req.t("reponses.connexion_succes"),
                Token: token
              });
            }
          })
      }).catch((error) => {
        next(error);
      })
  },
  obtenirTousUtilisateurs(req, res, next) {
    Utilisateur.obtenirUtilisateurs()
      .then((utilisateurs) => {
        // TODO Log get all with logger Middleware
        res.status(200).json({
          ApiMessage: req.t("reponses.obtenir_utilisateurs_succes"),
          objets: utilisateurs.map(user => user.toJSON(req.t))
        });
      })
      .catch((error) => {
        // TODO Log error with logger Middleware
        next(error);
      });
  }
}
export default ControleurUtilisateur;