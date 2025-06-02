import ErrorHandler from '../../middleware/ErrorHandler.js';
import SortModel from './SortModel.js';

class Sort {
  nom;
  niveau;
  ecole;
  effet;

  constructor(objet) {
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.niveau = objet.niveau;
    this.ecole = objet.ecole;
    this.effet = objet.effet || [];
  }

  async sauvegarder() {
    try {
      const sort = new SortModel({
        nom: this.nom,
        niveau: this.niveau,
        ecole: this.ecole,
        effet: this.effet
      });
      return await sort.save();
    } catch (error) {
      throw new ErrorHandler.AppError(400, `Erreur pendant la sauvegarde: ${error.message}`, true);
    }
  }
}

export default Sort;


