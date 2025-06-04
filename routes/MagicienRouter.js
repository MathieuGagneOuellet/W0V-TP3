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


router.post("/creer", MagicienController.creer);

router.get("/tous", MagicienController.obtenirTous)

export default router;