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
  }



}

export default ControleurGrimoire;