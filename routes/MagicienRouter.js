import express from "express";
import MagicienController from "../controller/MagicienController.js"
import MagicienModel from "../model/Magicien/MagicienModel.js";
import Magicien from "../model/Magicien/Magicien.js";

const router = express.Router();

// POSTMAN -> POST http://localhost:3000/api/magiciens/creer
router.post("/creer", MagicienController.creer);

// POSTMAN -> POST http://localhost:3000/api/magiciens/creer
// TODO router.post("/creerMultiples", MagicienController.creerMultiples);

// VALID URL -> GET http://localhost:3000/api/magiciens
router.get("/", MagicienController.obtenirTous);

// VALID URL -> GET http://localhost:3000/api/magiciens/:id
router.get("/:id", MagicienController.obtenirUnAvecId);

// POSTMAN -> PATCH http://localhost:3000/api/magiciens/:id
// TODO router.patch("/:id", MagicienController.majAvecId);

// POSTMAN -> DELETE http://localhost:3000/api/magiciens/:id
// TODO router.delete("/:id", MagicienController.supprimerAvecId);

export default router;