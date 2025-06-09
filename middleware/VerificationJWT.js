import jwt from 'jsonwebtoken';

/**
 * Middleware pour vérifier le JWT dans l'en-tête Authorization
 * Il extrait le token, le vérifie et ajoute l'utilisateur décodé à la requête.
 * Si le token est absent ou invalide, il renvoie une erreur 401 ou 403.
 * Source -> https://www.youtube.com/watch?v=favjC6EKFgw
 */
const VerificationJWT = (req, res, next) => {
  const authenticateurHeader = req.headers['authorization'];
  if (!authenticateurHeader) {
    return res.status(401).json({
      ApiMessage: req.t("erreur.verification_jwt_absent")
    });
  }
  const token = authenticateurHeader.split(' ')[1];

  // Vérification du token JWT
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenDecoder) => {
    if (err) {
      return res.status(403).json({
        ApiMessage: req.t("erreur.verification_jwt_invalide")
      });
    }
    req.utilisateur = tokenDecoder.utilisateur;
    next();
  });
}
export default VerificationJWT;