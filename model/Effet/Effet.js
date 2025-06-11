import ErrorHandler from "../../middleware/ErrorHandler.js";
import { Types } from "mongoose";
import EffetModel from "./EffetModel.js";

class Effet {
  nom;
  ecole;
  type;

  constructor(objet) {
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.ecole = objet.ecole;
    this.type = objet.type;
  }

  async sauvegarder() {
    try {
      const effet = new EffetModel({
        nom: this.nom,
        ecole: this.ecole,
        type: this.type
      });
      return await effet.save();
    } catch (error) {
      throw new ErrorHandler.AppError(400, "reponses.erreur_sauvegarde", true);
    }
  }

  static async creerEffet(objetEffet) {
    if (!objetEffet || typeof objetEffet !== 'object') {
      throw new ErrorHandler.AppError(400, "reponses.effet_invalide", true);
    }
    if (!objetEffet.nom || !objetEffet.ecole || !objetEffet.type) {
      throw new ErrorHandler.AppError(400, "reponses.effet_champs_manquants", true);
    }

    const effet = new Effet(objetEffet);
    await effet.sauvegarder();
    return effet;
  }
}

export default Effet;