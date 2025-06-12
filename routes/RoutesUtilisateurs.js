import express from "express";
import ControleurUtilisateur from "../controller/ControleurUtilisateur.js"
import VerificationJWT from "../middleware/VerificationJWT.js";

const RoutesUtilisateurs = express.Router();

RoutesUtilisateurs.post("/creer", ControleurUtilisateur.creerUnCompte); // VERIFIED
RoutesUtilisateurs.post("/connexion", ControleurUtilisateur.connexion); // VERIFIED

// Utilisation de la vérification JWT pour les routes suivantes
RoutesUtilisateurs.get("/", VerificationJWT, ControleurUtilisateur.obtenirTousUtilisateurs); // VERIFIED

export default RoutesUtilisateurs;