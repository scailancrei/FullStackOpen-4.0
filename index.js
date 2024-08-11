import config from "./utils/config.js"
import morgan from "morgan"
import express from "express"
import "express-async-errors"
import cors from "cors"
const app = express()
import blogsRouter from "./controllers/blogsControllers.js"
import usersRouter from "./controllers/usersControllers.js"
import loginRouter from "./controllers/loginControllers.js"
import middleware from "./utils/middleware.js"
import logger from "./utils/logger.js"
import mongoose from "mongoose"

morgan.token("user-ip", (req) => {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress
})

const customFormat = ":method :url :status :response-time ms - :user-ip"

mongoose.set("strictQuery", false)
logger.info("connecting to mongoDB")

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info(
      `connected to MongoDB, data base: ${mongoose.connection.db.databaseName}`
    )
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message)
  })
app.use(cors())

app.use(express.static("dist"))
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.getTokenExtractor)
app.use(morgan(customFormat))
app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

export default app
