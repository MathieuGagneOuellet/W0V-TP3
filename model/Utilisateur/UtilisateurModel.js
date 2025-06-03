import Mongoose from "mongoose";

const SchemaUtilisateur = new Mongoose.Schema({
  nomUtilisateur: {
    type: String,
    required: true
  },
  motDePasse: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

const UtilisateurModel = Mongoose.model("utilisateur", SchemaUtilisateur);
export default UtilisateurModel;