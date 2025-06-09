import express from "express";
import ControleurMagicien from "../controller/ControleurMagicien.js"
import VerificationJWT from "../middleware/VerificationJWT.js";

const RoutesMagiciens = express.Router();

// POSTMAN -> POST http://localhost:3000/api/magiciens/creer
RoutesMagiciens.post("/creer", VerificationJWT, ControleurMagicien.creer);

// VALID URL -> GET http://localhost:3000/api/magiciens
RoutesMagiciens.get("/", VerificationJWT, ControleurMagicien.obtenirTous);

// VALID URL -> GET http://localhost:3000/api/magiciens/:id
RoutesMagiciens.get("/:id", VerificationJWT, ControleurMagicien.obtenirUnAvecId);

// POSTMAN -> PATCH http://localhost:3000/api/magiciens/:id
RoutesMagiciens.patch("/maj/:id", VerificationJWT, ControleurMagicien.majAvecId);

// POSTMAN -> DELETE http://localhost:3000/api/magiciens/:id
RoutesMagiciens.delete("/:id", VerificationJWT, ControleurMagicien.supprimerAvecId);

export default RoutesMagiciens;