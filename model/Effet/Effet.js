import ErrorHandler from "../../middleware/ErrorHandler.js";
import EffetModel from "./EffetModel.js";

class Effet {
  nom;
  niveau;
  ecole;
  type;

  constructor(objet) {
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.niveau = objet.niveau;
    this.ecole = objet.ecole;
    this.type = objet.type;
  }

  async sauvegarder() {
    try {
      const effet = new EffetModel({
        nom: this.nom,
        niveau: this.niveau,
        ecole: this.ecole,
        type: this.type
      });
      return await effet.save();
    } catch (error) {
      throw new ErrorHandler.AppError(400, `Erreur pendant la sauvegarde: ${error.message}`, true);
    }
  }
}

export default Effet;