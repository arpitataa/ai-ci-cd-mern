require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const logsRoutes = require("./routes/logs")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

app.use("/api", logsRoutes)

app.listen(5000, () => {
  console.log("Backend server running on 5000")
})