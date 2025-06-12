import express from "express";
import ControleurSort from "../controller/ControleurSort.js";

const RoutesSorts = express.Router();

// POSTMAN -> POST http://localhost:3000/api/sorts/:idMagicien
RoutesSorts.post("/:idMagicien", ControleurSort.creer); // VERIFIED

// POSTMAN -> POST http://localhost:3000/api/sorts/magiciens/:idMagicien/sorts/lancer/:idSort
// http://localhost:3000/api/sorts/magiciens/111000000000000000000001/sorts/lancer/333000000000000000000001 fonctionne
RoutesSorts.post("/magiciens/:idMagicien/sorts/lancer/:idSort", ControleurSort.lancer); // VERIFIED

// POSTMAN -> DELETE http://localhost:3000/api/sorts/:idMagicien/:idSort
RoutesSorts.delete("/:idMagicien/:idSort", ControleurSort.supprimer); // VERIFIED

export default RoutesSorts;
