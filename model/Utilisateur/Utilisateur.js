import ErrorHandler from '../../middleware/ErrorHandler.js';
import UtilisateurModel from './UtilisateurModel.js';

class Utilisateur {
  nomUtilisateur;
  motDePasse;
  role;
  token;
  constructor(objet) {
    this.id = objet.id;
    this.nomUtilisateur = objet.nomUtilisateur;
    this.motDePasse = objet.motDePasse;
    this.role = objet.role;
    this.token = objet.token || null;
  }

  /**
   * Fonction toJSON qui permet de retourner un objet Utilisateur selon la langue choisie
   * @param {requete} traduction - Passez par la "headers request" (req.t)
   * @return Un objet Utilisateur Jsonified avec des valeurs traduites
   */
  toJSON(traduction) {
    const trad = (chemin, fallback) => {
      const resultat = traduction(chemin);
      return resultat !== chemin ? resultat : fallback;
    }

    return {
      id: this.id,
      [trad('etiquette.nom_utilisateur', "nom_utilisateur")]: this.nomUtilisateur,
      [trad('etiquette.mot_de_passe', "mot_de_passe")]: this.motDePasse,
      [trad('etiquette.role', "role")]: this.role,
    };
  }

  /**
   * Fonction de validation d'un objet Utilisateur
   * Cette fonction vérifie si l'objet Utilisateur possède les valeurs suivantes:
   * - nomUtilisateur: une chaîne de caractères d'au moins 6 caractères.
   * - motDePasse: une chaîne de caractères d'au moins 6 caractères.
   * - role: une chaîne de caractères qui doit être 'admin' ou 'utilisateur'.
   * @returns {boolean} - Si l'objet est valide, retourne true. Sinon, lance une erreur.
   * @throws {AppError} - Si l'objet Utilisateur n'est pas valide, une erreur est lancée selon l'invalidité.
   */
  validerUtilisateur() {
    if (!this.nomUtilisateur || typeof this.nomUtilisateur !== 'string' || this.nomUtilisateur.length < 6) {
      throw new ErrorHandler.AppError(400, "reponses.nom_utilisateur_invalide", true);
    }
    if (!this.motDePasse || typeof this.motDePasse !== 'string' || this.motDePasse.length < 6) {
      throw new ErrorHandler.AppError(400, "reponses.mot_de_passe_invalide", true);
    }
    const roles = ['admin', 'utilisateur'];
    if (!this.role || !roles.includes(this.role.toLowerCase())) {
      throw new ErrorHandler.AppError(400, "reponses.role_invalide", true);
    }
    return true;
  }

  async sauvegarder() {
    try {
      const utilisateur = new UtilisateurModel({
        nomUtilisateur: this.nomUtilisateur,
        motDePasse: this.motDePasse,
        role: this.role
      })
      return await utilisateur.save();
    } catch (erreur) {
      throw new ErrorHandler.AppError(erreur.statusCode, "reponses.erreur_sauvegarde", true);
    }
  }

  static async creerUtilisateur(reqObject) {
    try {
      const requete = reqObject;
      if (!requete || typeof requete !== "object")
        throw new ErrorHandler.AppError(400, "reponses.creer_utilisateur_erreur", true)

      const utilisateur = new Utilisateur(requete);
      const isValid = utilisateur.validerUtilisateur()
      if (!isValid) {
        throw new ErrorHandler.AppError(400, "reponses.creer_utilisateur_erreur", true)
      }
      await utilisateur.sauvegarder()
      return utilisateur;
    } catch (erreur) {
      if (erreur instanceof ErrorHandler.AppError) {
        throw erreur;
      }
      throw new Error(erreur);
    }
  }

  static async obtenirUtilisateurs() {
    try {
      const utilisateursDb = await UtilisateurModel.find({});
      if (!utilisateursDb || utilisateursDb.length === 0) {
        throw new ErrorHandler.AppError(404, "reponses.obtenir_utilisateurs_erreur", true);
      }

      const utilisateurs = [];
      utilisateursDb.forEach(u => {
        u = new Utilisateur(u2);
        utilisateurs.push(u);
      });

      return utilisateurs;
    } catch (erreur) {
      if (erreur instanceof ErrorHandler.AppError) {
        throw erreur;
      }
      throw new Error(erreur);
    }
  }

  static async obtenirUtilisateurParNom(nomUtilisateur) {
    try {
      const utilisateur = await UtilisateurModel.findOne({ nomUtilisateur: nomUtilisateur });
      if (!utilisateur) {
        throw new ErrorHandler.AppError(404, "reponses.utilisateur_non_trouve", true);
      }
      return new Utilisateur(utilisateur);
    } catch (erreur) {
      if (erreur instanceof ErrorHandler.AppError) {
        throw erreur;
      }
      throw new Error(erreur);
    }
  }
}
export default Utilisateur;