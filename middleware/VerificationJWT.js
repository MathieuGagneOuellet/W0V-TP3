import jwt from 'jsonwebtoken';

/**
 * Middleware pour vérifier le JWT dans l'en-tête Authorization
 * Il extrait le token, le vérifie et ajoute l'utilisateur décodé à la requête.
 * Si le token est absent ou invalide, il renvoie une erreur 401 ou 403.
 * Source -> https://www.youtube.com/watch?v=favjC6EKFgw
 */
const VerificationJWT = (req, res, next) => {
  try {
    const authenticateurHeader = req.headers['authorization'];
    if (!authenticateurHeader) {
      return res.status(401).json({
        ApiMessage: req.t("reponses.verification_jwt_absent")
      });
    }

    const token = authenticateurHeader.split(' ')[1];

    let decoder;

    try {
      decoder = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (e1) {
      try {
        decoder = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
      } catch (e2) {
        return res.status(403).json({
          ApiMessage: req.t("reponses.verification_jwt_invalide")
        });
      }
    }

    // Attach payload au `req` (pour avoir le rôle, etc.)
    req.utilisateur = decoder.utilisateur;
    next();
  } catch (error) {
    next(error);
  }
};

export default VerificationJWT;