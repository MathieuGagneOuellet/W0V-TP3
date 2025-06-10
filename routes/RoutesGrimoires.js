import express from "express";
import ControleurGrimoire from "../controller/ControleurGrimoire.js";

const RoutesGrimoires = express.Router();

// POSTMAN -> POST http://localhost:3000/api/grimoires/creer/:idMagicien
RoutesGrimoires.post("/:idMagicien", ControleurGrimoire.creer);

// POSTMAN -> POST http://localhost:3000/api/magiciens/:idMagicien/grimoires/acquerir/:idGrimoire
RoutesGrimoires.post("/magiciens/:idMagicien/grimoires/acquerir/:idGrimoire", ControleurGrimoire.acquerir);

// POSTMAN -> DELETE http://localhost:3000/api/magiciens/:idMagicien/grimoires/retirer/:idGrimoire
RoutesGrimoires.delete("/magiciens/:idMagicien/grimoires/retirer/:idGrimoire", ControleurGrimoire.retirer);

// POSTMAN -> POST http://localhost:3000/api/magiciens/:idMagicien/grimoires/:idGrimoire/sorts/:idSort
RoutesGrimoires.post("/:idMagicien/grimoires/:idGrimoire/sorts/:idSort", ControleurGrimoire.ajouterSort);

// POSTMAN -> DELETE http://localhost:3000/api/magiciens/:idMagicien/grimoires/:idGrimoire/sorts/:idSort
RoutesGrimoires.delete("/:idMagicien/grimoires/:idGrimoire/sorts/:idSort", ControleurGrimoire.retirerSort);

export default RoutesGrimoires;
