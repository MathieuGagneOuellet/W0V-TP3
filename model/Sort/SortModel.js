import Mongoose from "mongoose";

const SortSchema = new Mongoose.Schema({
  nom: {
    fr: {type: String, required: true},
    en: {type: String, required: true}
  },
  level: {
    type: Number,
    required: false
  },
  ecole: {
    type: String,
    required: false
  },
  effet: [{
    type: Mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Effet'
  }]
});

const SortModel = Mongoose.model("Sort", SortSchema);
export default SortModel;