// src / app.js: This is where you configure Express.You will initialize const app = express(), set up your middlewares (like CORS, cookie - parser, or JSON body limits), and import/mount your route files here.
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))// we have limited the json to 16 kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
//routes   import 
          

import UserRouter from './routes/user.router.js'
// routes declaration 
app.use("/api/v1/users", UserRouter)  



app.get("/ping", (req, res) => res.send("Pong!"));
export {app}