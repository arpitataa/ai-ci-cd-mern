const mongoose = require("mongoose")

const PipelineLogSchema = new mongoose.Schema({

  status: {
    type: String,
    required: true
  },

  logs: {
    type: String,
    required: true
  },

  ai_analysis: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model(
  "PipelineLog",
  PipelineLogSchema
)