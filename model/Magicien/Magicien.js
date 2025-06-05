import { Types } from "mongoose";
import { traduire } from "../../middleware/FonctionTraduire.js"
import ErrorHandler from "../../middleware/ErrorHandler.js";
import logger from "../../utils/logger.js"
import MagicienModel from "./MagicienModel.js"
import Valeurs from "../../utils/valeurs.js";

class Magicien {
  nom;
  niveau;
  apparance = {
    tenue: String,
    yeux: String,
    cheveux: String,
    barbe: String,
    baton: String,
  };
  statistique = {
    force: Number,
    dexterite: Number,
    intelligence: Number,
    constitution: Number,
    charisme: Number,
    sagesse: Number
  };
  ecole;
  alignement;
  grimoires;

  constructor(objet) {
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.niveau = objet.niveau;
    this.apparance = objet.apparance || {
      tenue: objet.apparance.tenue || "Robe",
      yeux: objet.apparance.yeux || "Bleus",
      cheveux: objet.apprance.cheveux || "Blanc",
      barbe: objet.apparance.barde || "Longue",
      baton: objet.apparance.baton || "Baton habille d'une pierre magique",
    }
    this.statistique = objet.statistique || {
      force: objet.statistique.force || Number(10),
      dexterite: objet.statistique.dexterite || Number(10),
      intelligence: objet.statistique.intelligence || Number(10),
      constitution: objet.statistique.constitution || Number(10),
      charisme: objet.statistique.charisme || Number(10),
      sagesse: objet.statistique.sagesse || Number(10)
    };
    this.ecole = objet.ecole || [];
    this.alignement = objet.alignement;
    this.grimoires = objet.grimoires || [];
  }

  async validerMagicien() {
    // nom
    if (!this.nom || typeof this.nom !== 'object' || !this.nom.fr || !this.nom.en)
      throw new ErrorHandler.AppError(400, "Le nom est invalide. Il doit etre une string. Il doit contenir une valeur francaise et avoir au minimum 3 caracteres.");

    // niveau
    if (!this.niveau || typeof this.niveau !== 'number' || this.niveau < 1 || this.niveau > 20)
      throw new ErrorHandler.AppError(400, "Le niveau est invalide, il doit etre entre 1 et 20.");

    // ecole must be Array
    const ecolesMagiques = Valeurs.ecoles;
    if (!this.ecole || !Array.isArray(this.ecole) ||
      !this.ecole.every(ecole => ecolesMagiques.includes(ecole.toLowerCase())))
      throw new ErrorHandler.AppError(400, "Les ecoles sont invalide, veuillez verifier votre requete.");

    // alignement
    const alignements = Valeurs.alignements;
    if (!this.alignement || !alignements.includes(this.alignement.toLowerCase()))
      throw new ErrorHandler.AppError(400, "L'alignement est invalide, veuillez verifier votre requete.");
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

  static creerMagicien(req, res, next) {
    const requete = req.body;
    if (!requete || typeof requete !== "object")
      throw new ErrorHandler.AppError(400, "creer_magicien_erreur", true)

    const magicien = new Magicien(req.body);
    magicien.validerMagicien()
      .then(() => {
        magicien.sauvegarder()
        res.status(201).json(magicien);
      })
      .catch(erreur => {
        next(erreur)
      })
  }

  static creerMagiciens(req, res, next) { }

  static async obtenirMagiciens(req, res, next) {
    try {
      const magiciens = await MagicienModel.find();
      if (!magiciens) {
        throw new ErrorHandler.AppError(400, traduire(req.langue, "magiciens_inacessible"), true)
      };

      res.status(200).json(magiciens);
    } catch (erreur) { next(erreur); }
  }

  static async obtenirMagicien(req, res, next) {
    try {
      const magicien = await MagicienModel.findById(req.params.id).populate("grimoirea");
      if (!magicien) {
        throw new ErrorHandler.AppError(400, "magicien_introuvable", true)
      };

      res.status(200).json(magicien);
    } catch (erreur) { next(erreur); }
  }

  static async majMagicien(req, res, next) {
    // Validation de type ObjectId
    if (!Types.ObjectId.isValid(req.params.id))
      throw new ErrorHandler.AppError(400, "Invalid component Id.", true);

    // Validation precaire de la requete
    const requete = req.body;
    if (!requete || typeof requete !== "object")
      throw new ErrorHandler.AppError(400, "maj_magicien_erreur", true)

    // Obtenir magiciens
    const magicien = await Magicien.Model.findByIdAndUpdate(req.params.id, req.body);
    if (!magicien) {
      throw new ErrorHandler.AppError(400, traduire(req.langue, "magicien_introuvable"), true)
    };

    const cleValideMagicien = Valeurs.magiciens;


    magicien.validerMagicien()
      .then(() => {
        // sauvegarder

        res.status(201).json(magicien);
      })
      .catch(erreur => {
        next(erreur)
      })
  }

  static suppressionMagicien(req, res, next) { }
}

export default Magicien;