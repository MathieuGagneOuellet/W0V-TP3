import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import ErrorHandler from "./middleware/ErrorHandler.js";
import { initialiserDB } from "./config/initialiserDB.js";
import RoutesPrincipale from "./routes/RoutesPrincipales.js";

// Source -> https://lokalise.com/blog/node-js-i18n-express-js-localization/
i18next
  .use(Backend)                     // Connects the file system backend
  .use(middleware.LanguageDetector) // Enables automatic language detection
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(), 'locales', '{{lng}}', '{{ns}}.json'), // Path to translation files
    },
    detection: {
      order: ['header', 'querystring', 'cookie'], // Priority: URL query string first, then cookies
      caches: ['cookie'],               // Cache detected language in cookies
    },
    fallbackLng: 'fr',                  // Default language when no language is detected
    preload: ['fr', 'en'],              // Preload these languages at startup
  });

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(middleware.handle(i18next)); // Integrates i18next with Express

// Router Principales
app.use("/", RoutesPrincipale);

// Middleware pour gérer les erreurs 
app.use(ErrorHandler.throwError);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connecté!");
    return initialiserDB(); //retour de la promesse
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    })
  })

  .catch((err) => console.error("Erreur MongoDB :", err));