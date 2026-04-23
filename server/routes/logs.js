const express = require("express")
const router = express.Router()
const axios = require("axios")

const Log = require("../models/PipelineLog")

router.post("/logs", async (req, res) => {

 const { status, logs } = req.body

 try {

  // Send logs to AI service
  const aiResponse = await axios.post("http://localhost:7000/analyze", {
 logs
})

  const aiAnalysis = aiResponse.data.analysis

  // Save to MongoDB
  const log = new Log({
   status,
   logs,
   aiAnalysis
  })

  await log.save()

  res.json(log)

 } catch (err) {

  console.log(err)

  res.status(500).json({ error: "AI analysis failed" })

 }

})

router.get("/logs", async (req, res) => {

 const logs = await Log.find().sort({ createdAt: -1 })

 res.json(logs)

})

module.exports = router