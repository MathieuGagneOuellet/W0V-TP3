import ErrorHandler from '../../middleware/ErrorHandler.js';
import GrimoireModel from './GrimoireModel.js';

class Grimoire {
  nom;
  ecole;
  sorts;
  proprietaire;

  constructor(objet) {
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.ecole = objet.ecole || [];
    this.sorts = objet.sorts || [];
    this.proprietaire = objet.proprietaire || null;
  }

  async sauvegarder() {
    try {
      const grimoire = new GrimoireModel({
        nom: this.nom,
        ecole: this.ecole,
        sorts: this.sorts,
        proprietaire: this.proprietaire
      });
      return await grimoire.save();
    } catch (error) {
      throw new ErrorHandler.AppError(400, `Erreur pendant la sauvegarde: ${error.message}`, true);
    }
  }
}

export default Grimoire;