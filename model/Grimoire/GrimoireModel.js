import Mongoose from "mongoose";

const GrimoireSchema = new Mongoose.Schema({
  nom: {
    fr: {type: String, required: true},
    en: {type: String, required: true}
  },
  ecole: {
    type: [String],
    required: true
  },
  sorts: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Sort'
  }],
  proprietaire: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Magicien',
    required: false
  }
});

const GrimoireModel = Mongoose.model("Grimoire", GrimoireSchema);
export default GrimoireModel;
