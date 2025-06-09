import Magicien from "../model/Magicien/Magicien.js";
import winston from "winston";
import "../middleware/WinstonLoggers.js";

const magicienLogs = winston.loggers.get("MagicienLogger");

const ControleurMagicien = {
  creer: (req, res, next) => { // VERIFIED
    const requete = req.body;
    Magicien.creerMagicien(requete)
      .then((magicien) => {

        magicienLogs.info("Magicien creer avec succes!", {
          method: { http: req.method, status: 201 },
          url: req.originalUrl,
          user: req.user ? req.user.username : "anonyme",
          objetId: magicien.id
        });

        res.status(201).json({
          ApiMessage: req.t("reponses.creer_magicien_succes"),
          objet: magicien.toJSON(req.t)
        });
      })
      .catch((error) => {
        next(error)
      })
  },
  obtenirTous: (req, res, next) => { // VERIFIED
    Magicien.obtenirMagiciens()
      .then((magiciens) => {
        res.status(200).json({
          ApiMessage: req.t("reponses.obtenir_magiciens_succes"),
          objets: magiciens.map(mage => mage.toJSON(req.t))
        });
      })
      .catch((error) => {

        next(error);
      });
  },
  obtenirUnAvecId: (req, res, next) => { // VERIFIED
    const idRequete = req.params.id;
    Magicien.obtenirMagicienAvecId(idRequete, next)
      .then((magicien) => {
        res.status(200).json({
          ApiMessage: req.t("reponses.obtenir_magicien_succes"),
          objet: magicien.toJSON(req.t)
        });
      })
      .catch((error) => {
        next(error);
      });
  },
  majAvecId: (req, res, next) => { // VERIFIED
    const requete = req.body;
    Magicien.majMagicien(req.params.id, requete)
      .then((magicien) => {
        magicienLogs.info("Magicien mis a jour avec succes!", {
          method: { http: req.method, status: 200 },
          url: req.originalUrl,
          user: req.user ? req.user.username : "anonyme",
          objetId: magicien.id
        });

        res.status(200).json({
          ApiMessage: req.t("reponses.maj_magicien_succes"),
          objet: magicien.toJSON(req.t)
        });
      })
      .catch((error) => {
        next(error);
      });
  },
  supprimerAvecId: (req, res, next) => { // VERIFIED
    const idRequete = req.params.id;
    Magicien.suppressionMagicien(idRequete)
      .then(() => {
        magicienLogs.info("Magicien supprimé avec succès!", {
          method: { http: req.method, status: 204 },
          url: req.originalUrl,
          user: req.user ? req.user.username : "anonyme",
          objetId: idRequete
        });

        res.status(200).json({
          ApiMessage: req.t("reponses.supprimer_magicien_succes"),
          objetId: idRequete
        });
      })
      .catch((error) => {
        next(error);
      });
  }
};
export default ControleurMagicien;