require("dotenv").config()

const express = require("express")
const cors = require("cors")
const Groq = require("groq-sdk")

const app = express()

app.use(cors())
app.use(express.json())

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

app.post("/analyze", async (req, res) => {

  const logs = req.body.logs

  try {

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a DevOps expert who analyzes CI/CD pipeline failures."
        },
        {
          role: "user",
          content: `Analyze this CI/CD pipeline error and explain the cause and fix:\n${logs}`
        }
      ]
    })

    res.json({
      analysis: response.choices[0].message.content
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "AI analysis failed"
    })
  }

})

app.listen(7000, () => {
  console.log("AI Service running on 7000")
})