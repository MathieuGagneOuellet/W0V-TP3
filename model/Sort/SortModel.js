import Mongoose from "mongoose";

const SortSchema = new Mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  niveau: {
    type: Number,
    required: false
  },
  ecole: {
    type: String,
    required: false
  },
  effet: {
    type: Mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Effet'
  }
});

const SortModel = Mongoose.model("Sort", SortSchema);
export default SortModel;