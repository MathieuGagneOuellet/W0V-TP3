import express from "express";
import RoutesMagiciens from "./RoutesMagiciens.js";
import RoutesSorts from "./RoutesSorts.js";
import RoutesGrimoires from "./RoutesGrimoires.js";
import RoutesUtilisateurs from "./RoutesUtilisateurs.js";
import VerificationJWT from "../middleware/VerificationJWT.js";

const RoutesPrincipales = express.Router();
RoutesPrincipales.use("/api/utilisateurs", RoutesUtilisateurs);
RoutesPrincipales.use("/api/magiciens", VerificationJWT, RoutesMagiciens);
RoutesPrincipales.use("/api/sorts", VerificationJWT, RoutesSorts); // Modification pour authentification non terminée
RoutesPrincipales.use("/api/grimoires", VerificationJWT, RoutesGrimoires); // Modification pour authentification non terminée

export default RoutesPrincipales;

