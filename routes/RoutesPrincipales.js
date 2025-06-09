import express from "express";
import RoutesMagiciens from "./RoutesMagiciens.js";
import RoutesUtilisateurs from "./RoutesUtilisateurs.js";
import VerificationJWT from "../middleware/VerificationJWT.js";


const RoutesPrincipales = express.Router();

RoutesPrincipales.use("/api/utilisateurs", RoutesUtilisateurs);
RoutesPrincipales.use("/api/magiciens", RoutesMagiciens);

export default RoutesPrincipales;
