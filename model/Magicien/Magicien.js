import ErrorHandler from "../../middleware/ErrorHandler.js";
import MagicienModel from "./MagicienModel.js"

class Magicien {
  nom;
  niveau;
  apparance = {
    "tenue": String,
    "yeux": String,
    "cheveux": String,
    "barbe": String,
    "baton": String,
  };
  statistique = {
    "force": Number,
    "dexterite": Number,
    "intelligence": Number,
    "constitution": Number,
    "charisme": Number,
    "sagesse": Number
  };
  ecole;
  alignement;
  grimoires;

  constructor(objet) {
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.niveau = objet.niveau;
    this.apparance = objet.apparance || {
      "tenue": "Robe",
      "yeux": "Bleus",
      "cheveux": "Blanc",
      "barbe": "Longue",
      "baton": "Baton habille d'une pierre magique",
    }
    this.statistique = objet.statistique || {
      "force": Number(10),
      "dexterite": Number(10),
      "intelligence": Number(10),
      "constitution": Number(10),
      "charisme": Number(10),
      "sagesse": Number(10)
    };
    this.ecole = objet.ecole || [];
    this.alignement = objet.alignement;
    this.grimoires = objet.grimoires || [];
  }

  async sauvegarder() {
    try {
      const magicien = new MagicienModel({
        nom: this.nom,
        niveau: this.niveau,
        apparance: this.apparance,
        statistique: this.statistique,
        ecole: this.ecole,
        alignement: this.alignement,
        grimoires: this.grimoires
      });
      return await magicien.save();
    } catch (error) {
      throw new ErrorHandler.AppError(400, `Erreur pendant la sauvegarde: ${error.message}`, true);
    }
  }
}

export default Magicien;