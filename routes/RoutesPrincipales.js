import express from "express";
import RoutesMagiciens from "./RoutesMagiciens.js";
import RoutesSorts from "./RoutesSorts.js";
import RoutesUtilisateurs from "./RoutesUtilisateurs.js";
import VerificationJWT from "../middleware/VerificationJWT.js";


const RoutesPrincipales = express.Router();

RoutesPrincipales.use("/api/utilisateurs", RoutesUtilisateurs);
RoutesPrincipales.use("/api/magiciens", RoutesMagiciens);
RoutesPrincipales.use("/api/sorts", RoutesSorts);


export default RoutesPrincipales;
