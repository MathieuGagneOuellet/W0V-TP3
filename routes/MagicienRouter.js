import express from "express";
import MagicienModel from "../model/Magicien/MagicienModel.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
    try {
        const magicien = await MagicienModel.findById(req.params.id).populate("grimoires");
        if(!magicien) {return res.status(404).json({message: "blblbl"})};

        res.status(200).json(magicien);
    } catch (e) {
        next(e);
    }
});
export default router;