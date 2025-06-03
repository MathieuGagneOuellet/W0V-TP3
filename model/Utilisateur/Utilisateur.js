import ErrorHandler from '../../middleware/ErrorHandler.js';
import UtilisateurModel from './UtilisateurModel.js';

class Utilisateur {
  nomUtilisateur;
  motDePasse;
  role;
  constructor(objet) {
    this.id = objet.id;
    this.nomUtilisateur = objet.nomUtilisateur;
    this.motDePasse = objet.motDePasse;
    this.role = objet.role;
  }

  async sauvegarder() {
    try {
      const utilisateur = new UtilisateurModel({
        nomUtilisateur: this.nomUtilisateur,
        motDePasse: this.motDePasse,
        role: this.role
      })
      return await utilisateur.save();
    } catch (error) {
      throw new ErrorHandler.AppError(400, `Erreur pendant la sauvegarde: ${error.message}`, true);
    }
  }

}
export default Utilisateur;