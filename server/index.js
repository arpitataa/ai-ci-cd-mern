const express = require("express")
const cors = require("cors")
const axios = require("axios")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

require("dotenv").config()

//mongodb connected
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

const PipelineLog = require("./models/PipelineLog")
// API to receive pipeline logs
app.post("/api/logs", async (req, res) => {

  const { status, logs } = req.body

  try {

    const aiResponse = await axios.post(
      "http://ai-service:7000/analyze",
      { logs: logs }
    )

    const analysis = aiResponse.data.analysis

    const log = new PipelineLog({
      status: status,
      logs: logs,
      ai_analysis: analysis
    })

    await log.save()

    res.json(log)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "AI analysis failed"
    })
  }

})

app.listen(5000, () => {
  console.log("Backend server running on 5000")
})
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await PipelineLog.find().sort({ createdAt: -1 })
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" })
  }
})