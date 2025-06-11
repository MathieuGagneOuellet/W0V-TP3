import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Utilisateur from '../model/Utilisateur/Utilisateur.js';
import ErrorHandler from '../middleware/ErrorHandler.js';

const ControleurUtilisateur = {
  creerUnCompte(req, res, next) { // VERIFIED
    const requete = req.body;
    Utilisateur.creerUtilisateur(requete)
      .then((utilisateur) => {
        res.status(201).json({
          ApiMessage: req.t("reponses.creer_utilisateur_succes"),
          objet: utilisateur.toJSON(req.t)
        });
      })
      .catch((error) => {
        next(error);
      });
  },
  async connexion(req, res, next) {
    const { nomUtilisateur, motDePasse } = req.body;

    if (!nomUtilisateur || !motDePasse) {
      return next(new ErrorHandler.AppError(400, "reponses.connexion_echec", true));
    }

    try {
      const utilisateurTrouve = await Utilisateur.obtenirUtilisateurParNom(nomUtilisateur);

      if (!utilisateurTrouve) {
        throw new ErrorHandler.AppError(404, "reponses.obtenir_utilisateur_erreur", true);
      }

      const motDePasseValide = await bcrypt.compare(motDePasse, utilisateurTrouve.motDePasse);
      if (!motDePasseValide) {
        throw new ErrorHandler.AppError(401, "reponses.mot_de_passe_invalide", true);
      }

      const donneesToken = {
        utilisateur: utilisateurTrouve.nomUtilisateur,
        role: utilisateurTrouve.role
      };

      const secret = utilisateurTrouve.role === "admin" ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;
      const expiration = utilisateurTrouve.role === "admin" ? "3d" : "15m";

      const jeton = jwt.sign(donneesToken, secret, { expiresIn: expiration });

      res.status(200).json({
        ApiMessage: req.t("reponses.connexion_succes"),
        Token: jeton
      });

    } catch (erreur) {
      next(erreur);
    }
  },
  obtenirTousUtilisateurs(req, res, next) {
    Utilisateur.obtenirUtilisateurs()
      .then((utilisateurs) => {
        res.status(200).json({
          ApiMessage: req.t("reponses.obtenir_utilisateurs_succes"),
          objets: utilisateurs.map(user => user.toJSON(req.t))
        });
      })
      .catch((error) => {
        next(error);
      });
  }
}
export default ControleurUtilisateur;