import { Types } from 'mongoose';
import i18n from "i18next";
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
        _id: this.id,
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

  //Créer un grimoire pour un mage existant. Doit respecter les règles métiers :
  //Le idMagicien est un ObjectId valide, qui pointe vers un magicien dans notre DB,
  //Le grimoireObj contient nom -> {fr, en}, ecole -> Array<String>, sorts -> matrice d'ObjectID valides qui pointe vers des sorts,
  static async creerGrimoire(idMagicien, grimoireObj) {
    //validations du magicien
    if (!Types.ObjectId.isValid(idMagicien)) {
      //valider que idMagicien est bien un ID Mongoose
      throw new ErrorHandler.AppError(400, "reponses.magicien_introuvable", true); 
    }
    const magicienDb = await MagicienModel.findById(idMagicien);
    if (!magicienDb) {
      //valider que l'id en paramètre de la fonction est bien identifiable à un id dans notre DB
      throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
    }

    //validations du grimoire
    if (!grimoireObj || typeof grimoireObj !== 'object') {
      //valider que grimoireObj est trouvable et localisable dans la DB
      throw new ErrorHandler.AppError(400, "reponses.grimoire_invalide", true);
    }
    if (!grimoireObj.nom || typeof grimoireObj.nom !== 'object' || !grimoireObj.nom.fr || !grimoireObj.nom.fr) {
      //valider que grimoireObj à tous les propriétés requises
      throw new ErrorHandler.AppError(400, "reponses.grimoire_invalide", true);
    }
    if (!Array.isArray(grimoireObj.ecole) || grimoireObj.ecole.length === 0) {
      //valider que grimoire possède un array d'écoles
      throw new ErrorHandler.AppError(400, "reponses.grimoire_invalide", true);
    }

    //validation de l'existence des sorts en référence dans le grimoire
    if (!Array.isArray(grimoireObj.sorts)) {
      //valider que les sorts du grimoire sont un array
      throw new ErrorHandler.AppError(400, "reponses.grimoire_invalide", true);
    }
    const sortsIds = grimoireObj.sorts;
    for (let id of sortsIds) {
      if (!Types.ObjectId.isValid(id)) {
        //valider que tous les sorts sont un objet Mongoose (via leur id)
        throw new ErrorHandler.AppError(400, "reponses.sort_invalide", true);
      }
    }
    const SortModel = (await import("../Sort/SortModel.js")).default;
    const sortsTrouves = await SortModel.find({_id: {$in: sortsIds}});
    if (sortsTrouves.length !== sortsIds.length) {
      //valider que tous les sorts qu'on référence existe vraiment dans la DB
      throw new ErrorHandler.AppError(404, "reponses.sorts_introuvables", true);
    }


    //Section "on est good, tout est OK"
    const grimoire = new Grimoire(grimoireObj);
    await grimoire.sauvegarder();
    magicienDb.grimoires.push(grimoire._id);
    await magicienDb.save();

    return grimoire;
  }

  


}

export default Grimoire;