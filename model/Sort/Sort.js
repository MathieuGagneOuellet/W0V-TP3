import { Types } from 'mongoose';
import i18n from "i18next";
import ErrorHandler from '../../middleware/ErrorHandler.js';
import MagicienModel from '../Magicien/MagicienModel.js';
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
        _id: this.id,
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

  ///Créer un sort si le magicien :
  ///Existe, possède l'école du sort, est de niveau >= niveau du sort
  static async creerSort(idMagicien, objetSort)
  {
    if (!Types.ObjectId.isValid(idMagicien)) {
      //valider que idMagicien est bien un ID Mongoose
      throw new ErrorHandler.AppError(400, "reponses.magicien_introuvable", true); 
    }
    const magicienDb = await MagicienModel.findById(idMagicien);
    if (!magicienDb) {
      //valider que l'id en paramètre de la fonction est bien identifiable à un id dans notre DB
      throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
    }
    
    //Section règles métier :
    if (!objetSort || typeof objetSort !== 'object') {
      throw new ErrorHandler.AppError(400, "reponses.sort_invalide", true);
    }
    if (typeof objetSort.niveau !== "number" || objetSort.niveau > magicienDb.niveau) {
      throw new ErrorHandler.AppError(400, "reponses.sort_invalide", true);      
    }
    if (!objetSort.ecole || !magicienDb.ecole.includes(objetSort.ecole)) {
      throw new ErrorHandler.AppError(400, "reponses.sort_ecole_non_autorisee", true);    
    }

    //Section "on est good, tout est OK"
    const sort = new Sort(objetSort);
    await sort.sauvegarder();
    return sort;
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


