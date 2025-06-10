import { Types } from 'mongoose';
import i18n from "i18next";
import ErrorHandler from '../../middleware/ErrorHandler.js';
import MagicienModel from './../Magicien/MagicienModel.js';
import GrimoireModel from './GrimoireModel.js';
import SortModel from './../Sort/SortModel.js';

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
    //valider que tous les sorts doivent appartenir à une école connue du magicien
    for (let sort of sortsTrouves) {
      if (!magicienDb.ecole.includes(sort.ecole)) {
        throw new AppError(400, "reponses.grimoire_sort_ecole_non_autorisee", true);
      }
    }


    //Section "on est good, tout est OK"
    const grimoire = new Grimoire(grimoireObj);
    await grimoire.sauvegarder();
    magicienDb.grimoires.push(grimoire._id);
    await magicienDb.save();

    return grimoire;
  }

  static async ajouterSortGrimoire(idMagicien, idGrimoire, idSort) {
    //validation des paramètres en entrée (doivent être des ObjetId valides)
    if (!Types.ObjectId.isValid(idMagicien) || !Types.ObjectId.isValid(idGrimoire) || !Types.ObjectId.isValid(idSort)) {
      throw new ErrorHandler.AppError(400, "reponses.id_invalide", true);
    }
    //validation des entités (doivent exister dans notre DB actuelle)
    const magicienDb = await MagicienModel.findById(idMagicien);
    const grimoireDb = await GrimoireModel.findById(idGrimoire);
    const sortDb = await SortModel.findById(idSort);

    if (!magicienDb) {
      throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
    }
    if (!grimoireDb) {
      throw new ErrorHandler.AppError(404, "reponses.grimoire_introuvable", true);
    }
    if (!sortDb) {
      throw new ErrorHandler.AppError(404, "reponses.sort_introuvable", true);
    }
    //validations metier
    if (!magicienDb.grimoires.includes(grimoireDb._id)) {
      //le grimoire n'appartient pas au magicien
      throw new ErrorHandler.AppError(403, "reponses.pas_proprietaire_grimoire", true);
    }
    if (grimoireDb.sorts.includes(sortDb._id)) {
      //le sort qu'on essaie d'ajouter est déjà dans ce grimoire
      throw new ErrorHandler.AppError(400, "reponses.sort_deja_present", true);
    }

    //section on est good
    grimoireDb.sorts.push(sortDb._id);
    await grimoireDb.save();
    return grimoireDb;
  }
  
  static async retirerSortGrimoire(idMagicien, idGrimoire, idSort) {
    //validation des paramètres en entrée (doivent être des ObjetId valides)
    if (!Types.ObjectId.isValid(idMagicien) || !Types.ObjectId.isValid(idGrimoire) || !Types.ObjectId.isValid(idSort)) {
      throw new ErrorHandler.AppError(400, "reponses.id_invalide", true);
    }
    //validation des entités (doivent exister dans notre DB actuelle)
    const magicienDb = await MagicienModel.findById(idMagicien);
    const grimoireDb = await GrimoireModel.findById(idGrimoire);
    const sortDb = await SortModel.findById(idSort);

    if (!magicienDb) {
      throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
    }
    if (!grimoireDb) {
      throw new ErrorHandler.AppError(404, "reponses.grimoire_introuvable", true);
    }
    if (!sortDb) {
      throw new ErrorHandler.AppError(404, "reponses.sort_introuvable", true);
    }
    //validations metier
    if (!magicienDb.grimoires.includes(grimoireDb._id)) {
      //le grimoire n'appartient pas au magicien
      throw new ErrorHandler.AppError(403, "reponses.pas_proprietaire_grimoire", true);
    }
    if (!grimoireDb.sorts.includes(sortDb._id)) {
      //le sort qu'on veut enlever n'est même pas dans le grimoire
      throw new ErrorHandler.AppError(403, "reponses.sort_absent", true);
    }

    //section on est good
    grimoireDb.sorts = grimoireDb.sorts.filter(id => !id.equals(sortDb._id));
    await grimoireDb.save();
    return grimoireDb;
  }

  static async acquerirGrimoire(idMagicien, idGrimoire) {
    //validation des paramètres en entrée (doivent être des ObjetId valides)
    if (!Types.ObjectId.isValid(idMagicien) || !Types.ObjectId.isValid(idGrimoire)) {
      throw new ErrorHandler.AppError(400, "reponses.id_invalide", true);
    }    
    //validation des entités (doivent exister dans notre DB actuelle)
    const magicienDb = await MagicienModel.findById(idMagicien);
    const grimoireDb = await GrimoireModel.findById(idGrimoire);
    if (!magicienDb) {
      throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
    }
    if (!grimoireDb) {
      throw new ErrorHandler.AppError(404, "reponses.grimoire_introuvable", true);
    }
    //validations métier
    if (magicienDb.grimoires.includes(grimoireDb._id)) {
      //si le magicien possède déjà ce grimoire
      throw new ErrorHandler.AppError(403, "reponses.deja_possede_grimoire", true);
    }

    //section on est good
    magicienDb.grimoires.push(grimoireDb._id);
    await magicienDb.save();
    return magicienDb;
  }

    static async retirerGrimoire(idMagicien, idGrimoire) {
    //validation des paramètres en entrée (doivent être des ObjetId valides)
    if (!Types.ObjectId.isValid(idMagicien) || !Types.ObjectId.isValid(idGrimoire)) {
      throw new ErrorHandler.AppError(400, "reponses.id_invalide", true);
    }    
    //validation des entités (doivent exister dans notre DB actuelle)
    const magicienDb = await MagicienModel.findById(idMagicien);
    const grimoireDb = await GrimoireModel.findById(idGrimoire);
    if (!magicienDb) {
      throw new ErrorHandler.AppError(404, "reponses.magicien_introuvable", true);
    }
    if (!grimoireDb) {
      throw new ErrorHandler.AppError(404, "reponses.grimoire_introuvable", true);
    }
    //validations métier
    if (!magicienDb.grimoires.includes(grimoireDb._id)) {
      //si le magicien ne possède pas ce grimoire
      throw new ErrorHandler.AppError(403, "reponses.possede_pas_grimoire", true);
    }

    //section on est good
    magicienDb.grimoires = magicienDb.grimoires.filter(id => !id.equals(grimoireDb._id));
    await magicienDb.save();
    return magicienDb;
  }


}

export default Grimoire;