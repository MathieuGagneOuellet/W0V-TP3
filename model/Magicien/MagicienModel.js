import Mongoose from "mongoose"

const MagicienSchema = new Mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  niveau: {
    type: Number,
    required: true
  },
  apparance: {
    type: Object,
    required: true
  },
  statistique: {
    type: Object,
    required: true
  },
  ecole: {
    type: [String],
    required: true
  },
  alignement: {
    type: String,
    required: true
  },
  grimoires: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Grimoire'
  }]
})

const MagicienModel = Mongoose.model("Magicien", MagicienSchema)
export default MagicienModel;