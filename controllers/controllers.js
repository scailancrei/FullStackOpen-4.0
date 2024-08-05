import express from "express"

import Blog from "../models/blogs.js"

const blogsRouter = express.Router()

blogsRouter.get("/", async (request, response) => {
  const data = await Blog.find({})
  response.status(200).json(data)
})

blogsRouter.get("/:id", async (req, res) => {
  const id = req.params.id
  const response = await Blog.findById(id)
  res.status(200).json(response)
})

blogsRouter.post("/", async (req, res) => {
  const blog = new Blog(req.body)

  const result = await blog.save()
  console.log(result)
  res.status(201).json(blog)
})

export default blogsRouter
