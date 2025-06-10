import Grimoire from "../model/Grimoire/Grimoire.js";
import winston from "winston";
import "../middleware/WinstonLoggers.js";

const grimoireLogs = winston.loggers.get("MagicienLogger");


const ControleurGrimoire = {
  // getGrimoire: async (req, res, next)
  // creerGrimoire:
  // ajouterSort:
  creer: (req, res, next) => {
    const idMagicien = req.params.idMagicien;
    const grimoireData=  req.body;

    Grimoire.creerGrimoire(idMagicien, grimoireData)
      .then((grimoire) => {
        grimoireLogs.info("Grimoire créé avec succès.", {
          method: {http: req.method, status: 201},
          url: req.originalUrl,
          user: req.utilisateur ? req.utilisateur.username: "anonyme",
          objetId: grimoire.id
        });

        res.status(201).json({
        ApiMessage: req.t("reponses.creer_grimoire_succes"),
        objet: grimoire
        });
      })
      .catch((erreur) => next(erreur));
  },

  ajouterSort: (req, res, next) => {
    const idMagicien = req.params.idMagicien;
    const idGrimoire = req.params.idGrimoire;
    const idSort = req.params.idSort;

    Grimoire.ajouterSortGrimoire(idMagicien, idGrimoire, idSort)
      .then((grimoire) => {
        grimoireLogs.info("Sort ajouté au grimoire.", {
          method: {http: req.method, status: 200},
          url: req.originalUrl,
          user: req.utilisateur ? req.utilisateur.username: "anonyme",
          objetId: grimoire.id,
          ajout: idSort
        });

        res.status(200).json({
          ApiMessage: req.t("reponses.ajouter_sort_grimoire_succes"),
          objet: grimoire
        });
      })
      .catch((erreur) => next(erreur));
  },

  retirerSort: (req, res, next) => {
    const {idMagicien, idGrimoire, idSort} = req.params;
    Grimoire.retirerSortGrimoire(idMagicien, idGrimoire, idSort)
      .then((grimoire) => {
        grimoireLogs.info("Sort retiré du grimoire.", {
        method: {http: req.method, status: 200},
        url: req.originalUrl,
        user: req.utilisateur ? req.utilisateur.username : "anonyme",
        objetId: grimoire.id,
        });
        res.status(200).json({
          ApiMessage: req.t("reponses.retirer_sort_grimoire_succes"),
          objet: grimoire
        })
      })
      .catch((erreur) => next(erreur));
  }

}

export default ControleurGrimoire;