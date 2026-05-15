const express = require("express")
const router = express.Router()
const axios = require("axios")

const PipelineLog = require("../models/PipelineLog")

router.post("/logs", async (req, res) => {

  const { status, logs } = req.body

  try {

    const aiResponse = await axios.post(
      "http://ai-service:7000/analyze",
      { logs }
    )

    const analysis = aiResponse.data.analysis

    const log = new PipelineLog({
      status,
      logs,
      ai_analysis: analysis
    })

    await log.save()

    res.json(log)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "AI analysis failed"
    })

  }

})

router.get("/logs", async (req, res) => {

  try {

    const logs = await PipelineLog.find()
      .sort({ createdAt: -1 })

    res.json(logs)

  } catch (err) {

    res.status(500).json({
      error: "Failed to fetch logs"
    })

  }

})

module.exports = router