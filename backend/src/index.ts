import express, { Request, Response } from "express"
import { connectDB } from "./db/mongo"
import dotenv from "dotenv";

dotenv.config()
const app = express()

const port = 3000

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!, Hi")
})

connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  
