import jwt from "jsonwebtoken"
import logger from "./logger.js"

const getTokenExtractor = async (request, response, next) => {
  const authorization = await request.get("authorization")
  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

const getUserExtractor = async (request, response, next) => {
  const token = await request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    logger.error("No token found")
    next()
  } else {
    request.user = decodedToken
    next()
  }
}

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("---")

  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" })
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" })
  }
  next(error)
}

export default {
  requestLogger,
  getUserExtractor,
  getTokenExtractor,
  unknownEndpoint,
  errorHandler,
}
