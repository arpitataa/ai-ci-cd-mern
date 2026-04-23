const mongoose = require("mongoose")

const PipelineLogSchema = new mongoose.Schema({

  status: String,

  logs: String,

  ai_analysis: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("PipelineLog", PipelineLogSchema)