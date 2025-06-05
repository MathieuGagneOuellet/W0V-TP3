import express from "express";
import MagicienController from "../controller/MagicienController.js"
import MagicienModel from "../model/Magicien/MagicienModel.js";
import Magicien from "../model/Magicien/Magicien.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
    try {
        const magicien = await MagicienModel.findById(req.params.id).populate("grimoires");
        if (!magicien) { return res.status(404).json({ message: "blblbl" }) };

        res.status(200).json(magicien);
    } catch (e) {
        next(e);
    }
});

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