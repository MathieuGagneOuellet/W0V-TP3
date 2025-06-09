import Magicien from "../model/Magicien/Magicien.js";

const ControleurMagicien = {
  i18nTest: (req, res, next) => {
    res.send({ title: req.t("title"), message: req.t("message") });
  },
  creer: (req, res, next) => {
    const requete = req.body;
    Magicien.creerMagicien(requete)
      .then((magicien) => {
        // TODO Log create with logger Middleware
        res.status(201).json({
          ApiMessage: req.t("reponses.creer_magicien_succes"),
          objet: magicien.toJSON(req.t)
        });
      })
      .catch((error) => {
        // TODO Log error with logger Middleware
        next(error)
      })
  },
  creerMultiples: Magicien.creerMagiciens,
  obtenirTous: (req, res, next) => {
    Magicien.obtenirMagiciens()
      .then((magiciens) => {
        // TODO Log get all with logger Middleware
        res.status(200).json({
          ApiMessage: req.t("reponses.obtenir_magiciens_succes"),
          objets: magiciens.map(mage => mage.toJSON(req.t))
        });
      })
      .catch((error) => {
        // TODO Log error with logger Middleware
        next(error);
      });
  },
  obtenirUnAvecId: (req, res, next) => {
    const idRequete = req.params.id;
    Magicien.obtenirMagicienAvecId(idRequete, next)
      .then((magicien) => {
        // TODO Log get with logger Middleware
        res.status(200).json({
          ApiMessage: req.t("reponses.obtenir_magicien_succes"),
          objet: magicien.toJSON(req.t)
        });
      })
      .catch((error) => {
        // TODO Log error with logger Middleware
        next(error);
      });
  },
  majAvecId: Magicien.majMagicien,
  supprimerAvecId: Magicien.suppressionMagicien
}

export default ControleurMagicien;