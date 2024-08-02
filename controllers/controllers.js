import express from "express"
import logger from "../utils/logger.js"
import Blog from "../models/blogs.js"

const blogsRouter = express.Router()

blogsRouter.get("/", (request, response) => {
  console.log(request)
  Blog.find({})
    .then((blogs) => {
      response.json(blogs)
    })
    .catch((error) => {
      logger.error(error)
    })
})

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then((result) => {
      response.status(201).json(result)
    })
    .catch((error) => response.status(400).json({ error: error.message }))
})

export default blogsRouter
