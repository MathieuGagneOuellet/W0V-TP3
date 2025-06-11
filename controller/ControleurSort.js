import Sort from "../model/Sort/Sort.js";
import winston from "winston";
import "../middleware/WinstonLoggers.js";

const sortLogs = winston.loggers.get("MagicienLogger");

const ControleurSort = {
    creer: (req, res, next) => {
        const idMagicien = req.params.idMagicien;
        const requete = req.body;

        Sort.creerSort(idMagicien, requete)
            .then((sort) => {
                sortLogs.info("Sort créé avec succès.", {
                    method: { http: req.method, status: 201 },
                    url: req.originalUrl,
                    user: req.utilisateur ? req.utilisateur.username : "anonyme",
                    objetId: sort.id
                });

                res.status(201).json({
                    ApiMessage: req.t("reponses.creer_sort_succes"),
                    objet: sort
                });
            })
            .catch((erreur) => {
                next(erreur);
            });
    }
}

export default ControleurSort;