import Magicien from "../model/Magicien/Magicien.js";

const MagicienController = {
  creer: Magicien.creerMagicien,
  obtenirTous: Magicien.obtenirTous,
  obtenirUnAvecId: Magicien.obtenirUn
}

export default MagicienController;