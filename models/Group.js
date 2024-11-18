const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const schema = mongoose.Schema;

const groupSchema = new schema({
  name: {
    type: String,
    required: true, // Le nom du groupe est obligatoire
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence la collection "User"
      required: true, // Chaque utilisateur dans le groupe doit être valide
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Ajoute automatiquement la date de création
  },
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
});

module.exports = mongoose.model("Group", groupSchema);
