import express from "express";
import ControleurGrimoire from "../controller/ControleurGrimoire.js";

const RoutesGrimoires = express.Router();

// POSTMAN -> POST http://localhost:3000/api/grimoires/creer/:idMagicien
RoutesGrimoires.post("/:idMagicien", ControleurGrimoire.creer);

export default RoutesGrimoires;
