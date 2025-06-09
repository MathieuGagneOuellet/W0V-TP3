import { Types } from "mongoose";
import ErrorHandler from "../../middleware/ErrorHandler.js";
import MagicienModel from "./MagicienModel.js"
import Valeurs from "../../utils/valeurs.js";
// import { traduire } from "../../middleware/FonctionTraduire.js"
//import logger from "../../utils/logger.js"

class Magicien {
  userId;
  nom;
  niveau;
  apparence = {
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
    this.userId = objet.userId || null;
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.niveau = objet.niveau;
    this.apparence = objet.apparence || {
      tenue: objet.apparence.tenue || "Robe",
      yeux: objet.apparence.yeux || "Bleus",
      cheveux: objet.apprence.cheveux || "Blanc",
      barbe: objet.apparence.barde || "Longue",
      baton: objet.apparence.baton || "Baton habille d'une pierre magique",
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

  /**
   * Fonction toJSON qui permit de retourner un objet magicien selon la langue choisie
   * @param {requete} traduction - Passez par la "headers request" (req.t)  
   * @returns Un objet magicien Jsonified avec des valeurs traduites
   */
  toJSON(traduction) {
    // CONST qui est une fonction utilitaire qui contient un fallback si la key n’existe pas
    // comme pour les valeurs francaise qui sont par defaut
    const trad = (chemin, fallback) => {
      const resultat = traduction(chemin);
      return resultat !== chemin ? resultat : fallback;
    };

    // Apparence traduite (valeurs brutes, mais étiquettes traduites)
    const apparenceTraduit = {
      [trad("etiquette.apparence", "apparence")]: {
        [trad("etiquette.tenue", "tenue")]: this.apparence.tenue,
        [trad("etiquette.yeux", "yeux")]: this.apparence.yeux,
        [trad("etiquette.cheveux", "cheveux")]: this.apparence.cheveux,
        [trad("etiquette.barbe", "barbe")]: this.apparence.barbe,
        [trad("etiquette.baton", "baton")]: this.apparence.baton
      }
    };

    // Statistiques avec étiquettes traduites
    const stats = {
      [trad("etiquette.force", "force")]: this.statistique.force,
      [trad("etiquette.dexterite", "dexterite")]: this.statistique.dexterite,
      [trad("etiquette.intelligence", "intelligence")]: this.statistique.intelligence,
      [trad("etiquette.constitution", "constitution")]: this.statistique.constitution,
      [trad("etiquette.charisme", "charisme")]: this.statistique.charisme,
      [trad("etiquette.sagesse", "sagesse")]: this.statistique.sagesse
    };

    // Alignement et écoles traduits
    const ecolesTraduites = this.ecole.map(ecole => trad(`ecoles.${ecole}`, ecole));
    const alignementTraduit = trad(`alignements.${this.alignement}`, this.alignement);

    return {
      id: this.id,
      [trad("etiquette.nom", "nom")]: this.nom[traduction("lng")] || this.nom.fr,
      [trad("etiquette.niveau", "niveau")]: this.niveau,
      ...apparenceTraduit,
      ...stats,
      [trad("etiquette.ecoles", "ecoles")]: ecolesTraduites,
      [trad("etiquette.alignement", "alignement")]: alignementTraduit,
      [trad("etiquette.grimoires", "grimoires")]: this.grimoires
    };
  }

  /**
   * Fonction de validation d'un objet magicien.
   * Cette fonction vérifie si l'objet magicien possede les valeurs suivantes:
   * - nom: un objet avec des valeurs en français et en anglais.
   * - niveau: un nombre entre 1 et 20.
   * - ecole: un tableau contenant des valeurs valides d'ecoles de magie.
   * - alignement: une valeur valide d'alignement.
   * @returns Si l'objet est valide, retourne true. Sinon, lance une erreur.
   * @throws {AppError} Si l'objet magicien n'est pas valide, une erreur est lancée selon l'invalidité.
   */
  validerMagicien() {
    // nom
    if (!this.nom || typeof this.nom !== 'object' || !this.nom.fr || !this.nom.en)
      throw new ErrorHandler.AppError(400, "reponses.validation_magicien_erreur", true);

    // niveau
    if (!this.niveau || typeof this.niveau !== 'number' || this.niveau < 1 || this.niveau > 20)
      throw new ErrorHandler.AppError(400, "reponses.validation_magicien_erreur", true);

    // ecole must be Array
    const ecolesMagiques = Valeurs.ecoles;
    if (!this.ecole || !Array.isArray(this.ecole) ||
      !this.ecole.every(ecole => ecolesMagiques.includes(ecole.toLowerCase())))
      throw new ErrorHandler.AppError(400, "reponses.validation_magicien_erreur", true);

    // alignement
    const alignements = Valeurs.alignements;
    if (!this.alignement || !alignements.includes(this.alignement.toLowerCase()))
      throw new ErrorHandler.AppError(400, "reponses.validation_magicien_erreur", true);
    return true;
  }

  /**
   * Fonction asynchrone qui crée une instance de MagicienModel avec les propriétés du magicien
   * et l'enregistre dans la base de données MongoDB.
   * @throws {AppError} Si une erreur se produit pendant la sauvegarde, une erreur est lancée.
   */
  async sauvegarder() {
    try {
      const magicien = new MagicienModel({
        nom: this.nom,
        niveau: this.niveau,
        apparence: this.apparence,
        statistique: this.statistique,
        ecole: this.ecole,
        alignement: this.alignement,
        grimoires: this.grimoires
      });
      return await magicien.save();
    } catch (erreur) {
      throw new ErrorHandler.AppError(erreur.statusCode, "reponses.erreur_sauvegarde", true);
    }
  }

  static async creerMagicien(reqObject) {
    try {
      const requete = reqObject;
      if (!requete || typeof requete !== "object")
        throw new ErrorHandler.AppError(400, "creer_magicien_erreur", true)

      const magicien = new Magicien(requete);
      const isValid = magicien.validerMagicien()
      if (!isValid) {
        throw new ErrorHandler.AppError(400, "creer_magicien_erreur", true)
      }
      const magicienDb = await magicien.sauvegarder()
      return magicienDb;
    } catch (erreur) {
      if (erreur instanceof ErrorHandler.AppError) {
        throw erreur;
      }
      throw new Error(erreur);
    }
  }

  // TODO Batch create
  static creerMagiciens() { }

  static async obtenirMagiciens() {
    try {
      const magiciensDb = await MagicienModel.find();
      if (!magiciensDb || magiciensDb.length === 0) {
        throw new ErrorHandler.AppError(400, "reponses.magiciens_inacessible", true)
      };

      // Creer des objets Magiciens propre pour la réponse toJSON
      const magiciens = [];
      magiciensDb.forEach(mage => {
        mage = new Magicien(mage);
        magiciens.push(mage);
      });

      return magiciens;
    } catch (erreur) {
      if (erreur instanceof ErrorHandler.AppError) {
        throw erreur;
      }
      throw new Error(erreur);
    }
  }

  static async obtenirMagicienAvecId(idRequete) {
    try {
      const magicienDb = await MagicienModel
        .findById(idRequete)
        .populate("grimoires");

      if (!magicienDb) {
        throw new ErrorHandler.AppError(400, "reponses.magicien_introuvable", true)
      };

      const magicien = new Magicien(magicienDb);
      return magicien;
    } catch (erreur) {
      if (erreur instanceof ErrorHandler.AppError) {
        throw erreur;
      }
      throw new Error(erreur);
    }
  }

  // TODO Terminer et Adapter la fonction a la structure MVC
  static async majMagicien(req, res, next) {
    // // Validation de type ObjectId
    // if (!Types.ObjectId.isValid(req.params.id))
    //   throw new ErrorHandler.AppError(400, "Invalid component Id.", true);

    // // Validation precaire de la requete
    // const requete = req.body;
    // if (!requete || typeof requete !== "object")
    //   throw new ErrorHandler.AppError(400, "maj_magicien_erreur", true)

    // // Obtenir magiciens
    // const magicien = await Magicien.Model.findByIdAndUpdate(req.params.id, req.body);
    // if (!magicien) {
    //   throw new ErrorHandler.AppError(400, traduire(req.langue, "magicien_introuvable"), true)
    // };

    // const cleValideMagicien = Valeurs.magiciens;

    // magicien.validerMagicien()
    //   .then(() => {
    //     // sauvegarder

    //     res.status(201).json(magicien);
    //   })
    //   .catch(erreur => {
    //     next(erreur)
    //   })
  }

  static suppressionMagicien(req, res, next) { }
}

export default Magicien;