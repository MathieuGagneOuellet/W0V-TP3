import express from "express";
import ControleurMagicien from "../controller/ControleurMagicien.js"

const RoutesMagiciens = express.Router();

// POSTMAN -> POST http://localhost:3000/api/magiciens/creer
RoutesMagiciens.post("/creer", ControleurMagicien.creer);

// VALID URL -> GET http://localhost:3000/api/magiciens
RoutesMagiciens.get("/", ControleurMagicien.obtenirTous);

// VALID URL -> GET http://localhost:3000/api/magiciens/:id
RoutesMagiciens.get("/:id", ControleurMagicien.obtenirUnAvecId);

// POSTMAN -> PATCH http://localhost:3000/api/magiciens/:id
RoutesMagiciens.patch("/maj/:id", ControleurMagicien.majAvecId);

// POSTMAN -> DELETE http://localhost:3000/api/magiciens/:id
RoutesMagiciens.delete("/:id", ControleurMagicien.supprimerAvecId);

export default RoutesMagiciens;