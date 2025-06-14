import express from "express"
import cors from "cors"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static(join(__dirname, "dist")))




  
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"))
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

