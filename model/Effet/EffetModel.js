import Mongoose from "mongoose";

const effetSchema = new Mongoose.Schema({
  nom: {
    fr: { type: String, required: true },
    en: { type: String, required: true }
  },
  ecole: {
    type: String,
    required: true
  },
  type: {
    type: [String],
    required: true
  }
});

const EffetModel = Mongoose.model("Effet", effetSchema);
export default EffetModel;
