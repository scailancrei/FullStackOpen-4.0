import config from "./utils/config.js"
import express from "express"
import "express-async-errors"
import cors from "cors"
const app = express()
import blogsRouter from "./controllers/controllers.js"
import middleware from "./utils/middleware.js"
import logger from "./utils/logger.js"
import mongoose from "mongoose"

mongoose.set("strictQuery", false)
logger.info("connecting to mongoDB")

mongoose
  .connect(config.MONGODB_URI)
  .then((e) => {
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

app.use("/api/blogs", blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

export default app
