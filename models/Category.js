const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categoriesSchema = new schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", categoriesSchema);
