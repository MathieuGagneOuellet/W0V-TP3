import express from "express";
import ControleurSort from "../controller/ControleurSort.js";

const RoutesSorts = express.Router();

// POSTMAN -> POST http://localhost:3000/api/sorts/:idMagicien
RoutesSorts.post("/:idMagicien", ControleurSort.creer);

export default RoutesSorts;
