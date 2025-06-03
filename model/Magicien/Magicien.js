import ErrorHandler from "../../middleware/ErrorHandler.js";
import MagicienModel from "./MagicienModel.js"
import ValeursPermise from "../../utils/ValeursPermise.js";

class Magicien {
  nom;
  niveau;
  apparance = {
    tenue: String,
    yeux: String,
    cheveux: String,
    barbe: String,
    baton: String,
  };
  statistique = {
    force: Number,
    dexterite: Number,
    intelligence: Number,
    constitution: Number,
    charisme: Number,
    sagesse: Number
  };
  ecole;
  alignement;
  grimoires;

  constructor(objet) {
    this.id = objet.id || objet._id || null;
    this.nom = objet.nom;
    this.niveau = objet.niveau;
    this.apparance = objet.apparance || {
      tenue: objet.apparance.tenue || "Robe",
      yeux: objet.apparance.yeux || "Bleus",
      cheveux: objet.apprance.cheveux || "Blanc",
      barbe: objet.apparance.barde || "Longue",
      baton: objet.apparance.baton || "Baton habille d'une pierre magique",
    }
    this.statistique = objet.statistique || {
      force: objet.statistique.force || Number(10),
      dexterite: objet.statistique.dexterite || Number(10),
      intelligence: objet.statistique.intelligence || Number(10),
      constitution: objet.statistique.constitution || Number(10),
      charisme: objet.statistique.charisme || Number(10),
      sagesse: objet.statistique.sagesse || Number(10)
    };
    this.ecole = objet.ecole || [];
    this.alignement = objet.alignement;
    this.grimoires = objet.grimoires || [];
  }

  validateMagicien() {
    // nom
    if (!this.nom || typeof this.nom !== 'string' || this.nom.length < 3)
      throw new ErrorHandler.AppError(400, "Le nom est invalide, il doit etre une string et au minimum 3 caracteres.");

    // niveau
    if (!this.niveau || typeof this.niveau !== 'number' || this.niveau < 1 || this.niveau > 20)
      throw new ErrorHandler.AppError(400, "Le niveau est invalide, il doit etre entre 1 et 20.");

    // ecole must be Array
    const ecolesMagiques = ValeursPermise.ecolesMagiques;
    if (!this.ecole || !Array.isArray(this.ecole) ||
      !this.ecole.every(ecole => ecolesMagiques.includes(ecole)))
      throw new ErrorHandler.AppError(400, "Les ecoles sont invalide, veuillez verifier votre requete.");

    // alignement
    const alignements = ValeursPermise.alignements;
    if (!this.alignement || !alignements.includes(this.alignement))
      throw new ErrorHandler.AppError(400, "L'alignement est invalide, veuillez verifier votre requete.");
  }

  async sauvegarder() {
    try {
      const magicien = new MagicienModel({
        nom: this.nom,
        niveau: this.niveau,
        apparance: this.apparance,
        statistique: this.statistique,
        ecole: this.ecole,
        alignement: this.alignement,
        grimoires: this.grimoires
      });
      return await magicien.save();
    } catch (error) {
      throw new ErrorHandler.AppError(400, `Erreur pendant la sauvegarde: ${error.message}`, true);
    }
  }

  static creerMagicien(req, res, next) {
    if (!req.body || !isObject(req.body))
      throw new ErrorHandler.AppError(400, `Le corps de la requete est invalide.`)

    const magicien = req.body;
    magicien
      .validateMagicien()
      .then(() => {

        const nouveauMagicien = new Magicien(magicien)
        magicien.sauvegarder()

        res.status(200).json(nouveauMagicien);
      })
      .catch(next(erreur))
  }
}

export default Magicien;