import Mongoose from "mongoose";

const effetSchema = new Mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  niveau: {
    type: Number,
    required: true
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
