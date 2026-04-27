const mongoose = require("mongoose");

const authoritySchema = new mongoose.Schema({

  area: {
    type: String,
    required: true
  },

  issueType: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model("Authority", authoritySchema);