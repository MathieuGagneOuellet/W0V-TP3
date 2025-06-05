import Magicien from "../model/Magicien/Magicien.js";

const MagicienController = {
  creer: Magicien.creerMagicien,
  creerMultiples: Magicien.creerMagiciens,
  obtenirTous: Magicien.obtenirMagiciens,
  obtenirUnAvecId: Magicien.obtenirMagicien,
  majAvecId: Magicien.majMagicien,
  supprimerAvecId: Magicien.suppressionMagicien
}

export default MagicienController;