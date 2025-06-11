import express from "express";
import ControleurUtilisateur from "../controller/ControleurUtilisateur.js"
import VerificationJWT from "../middleware/VerificationJWT.js";

const RoutesUtilisateurs = express.Router();

RoutesUtilisateurs.post("/creer", ControleurUtilisateur.creerUnCompte);
RoutesUtilisateurs.post("/connexion", ControleurUtilisateur.connexion);

// Utilisation de la vérification JWT pour les routes suivantes
RoutesUtilisateurs.get("/", VerificationJWT, ControleurUtilisateur.obtenirTousUtilisateurs);

export default RoutesUtilisateurs;