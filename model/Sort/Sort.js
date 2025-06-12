import { Types } from 'mongoose';
import mongoose from 'mongoose';
import ErrorHandler from '../../middleware/ErrorHandler.js';
import Aleatoire from '../../utils/random.js';
import Valeurs from '../../utils/valeurs.js';
import MagicienModel from '../Magicien/MagicienModel.js';
import SortModel from './SortModel.js';
import EffetModel from '../Effet/EffetModel.js';

class Sort {
  nom;
  niveau;
  ecole;
  effet;

  constructor(objet) {
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.niveau = objet.niveau || null;
    this.ecole = objet.ecole || null;
    this.effet = objet.effet || [];
  }

  async sauvegarder() {
    try {
      const sort = new SortModel({
        _id: this.id,
        nom: this.nom,
        niveau: this.niveau,
        ecole: this.ecole,
        effet: this.effet
      });
      return await sort.save();
    } catch (erreur) {
      if (erreur instanceof ErrorHandler.AppError) {
        throw erreur;
      }
      throw new Error(erreur);
    }
  }

  ///Créer un sort si le magicien :
  ///Existe, possède l'école du sort, est de niveau >= niveau du sort
  static async creerSort(idMagicien, objetSort) {
    if (!Types.ObjectId.isValid(idMagicien)) {
      throw new ErrorHandler.AppError(400, "reponses.magicien_introuvable", true);
    }
    const magicienDb = await MagicienModel.findById(idMagicien);
    if (!magicienDb) {
      throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
    }

    const effetsDb = await EffetModel.find();
    if (!effetsDb) {
      throw new ErrorHandler.AppError(404, "reponses.effets_introuvable", true)
    }
    const effetsObjetsId = effetsDb.map(effet => effet._id);

    // Vérifie si l'objet contient niveau, ecole et effet
    let { nom, niveau, ecole, effet } = objetSort;

    // Génère les valeurs manquantes
    if (!niveau && !ecole && !effet) {
      let effetAleatoire = [];
      niveau = Aleatoire.obtientNombreAleatoire(1, magicienDb.niveau);
      ecole = Aleatoire.obtientElementAleatoire(magicienDb.ecole);

      const genererEffetAleatoire = () => {
        return Aleatoire.obtientElementAleatoire(effetsObjetsId);
      }

      // Genere les effets aleatoires selon le niveau du sort
      if (niveau <= 10) {
        const effetIdSingulier = genererEffetAleatoire();
        effetAleatoire = effetIdSingulier;
      } else if (niveau > 10) {
        // Deux effets
        const effetIdDouble = genererEffetAleatoire() + genererEffetAleatoire();
        effetAleatoire = effetIdDouble;
      }
      effet = []
      effet.push(effetAleatoire);


      // Validation des champs requis
      if (!nom || !niveau || !ecole || !effet) {
        throw new ErrorHandler.AppError(400, "reponses.sort_invalide", true);
      }

      // Validation règles métier
      if (typeof niveau !== 'number' || niveau > magicienDb.niveau) {
        throw new ErrorHandler.AppError(400, "reponses.niveau_insuffisant", true);
      }

      // Validation si l'école est autorisée
      if (!magicienDb.ecole.includes(ecole)) {
        throw new ErrorHandler.AppError(400, "reponses.ecole_non_autorisee", true);
      }

      const sort = new Sort({ nom, niveau, ecole, effet });
      await sort.sauvegarder();
      return sort;
    }
  }

  static async supprimerSortAvecId(idMagicien, idSort) {
    //validation des paramètres en entrée (doivent être des ObjetId valides)
    if (!Types.ObjectId.isValid(idMagicien) || !Types.ObjectId.isValid(idSort)) {
      throw new ErrorHandler.AppError(400, "reponses.id_invalide", true);
    }

    //récupération des entités
    return MagicienModel.findByIdAndUpdate(
      idMagicien,
      { $pull: { grimoires: { sorts: idSort } } },
      { new: true }
    ).then(async (magicienDb) => {
      if (!magicienDb) {
        throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
      }
      const sort = SortModel.findByIdAndDelete(idSort).then(sortDb => {
        if (!sort) {
          throw new ErrorHandler.AppError(404, "reponses.sort_introuvable", true);
        }
        return sort
      });
    });
  }

  static async lancerSort(idMagicien, idSort) {
    //validation des paramètres en entrée (doivent être des ObjetId valides)
    if (!Types.ObjectId.isValid(idMagicien) || !Types.ObjectId.isValid(idSort)) {
      throw new ErrorHandler.AppError(400, "reponses.id_invalide", true);
    }

    //récupération des entités
    const magicienDb = await MagicienModel.findById(idMagicien).populate("grimoires");
    const sortDb = await SortModel.findById(idSort);
    if (!magicienDb) {
      throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
    }
    if (!sortDb) {
      throw new ErrorHandler.AppError(404, "reponses.sort_introuvable", true);
    }
    //le sort est bel et bien dans un grimoire du magicien
    const sortConnu = magicienDb.grimoires
      .some(grimoire => grimoire.sorts
        .some(id => id.equals(sortDb._id))); //vérifie si, parmi les grimoires du mage, l'un d'eux contient le sort
    if (!sortConnu) {
      throw new ErrorHandler.AppError(403, "reponses.sort_non_connu", true);
    }
    if (!magicienDb.ecole.includes(sortDb.ecole)) {
      //valider que le magicien connaisse l'école du sort
      throw new ErrorHandler.AppError(403, "reponses.ecole_sort_non_connue", true);
    }
    if (magicienDb.niveau < sortDb.niveau) {
      //valider que le magicien est de niveau suffisant
      throw new ErrorHandler.AppError(403, "reponses.niveau_insuffisant", true);
    }

    //section on est good
    return {
      message: "Le sort est lancé!",
      sort: {
        id: sortDb._id,
        nom: sortDb.nom,
        ecole: sortDb.ecole,
        niveau: sortDb.niveau
      }
    };
  }

}

export default Sort;


