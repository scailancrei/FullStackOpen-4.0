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

  res.status(201).json(blog)
})

blogsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params

  const result = await Blog.findByIdAndDelete(id)

  res.status(204).json(result)
})

blogsRouter.put("/:id", async (req, res) => {
  const { id } = req.params
  const likes = req.body.likes

  const result = await Blog.findByIdAndUpdate(
    id,
    { likes: likes },
    { new: true }
  )

  res.status(200).json(result)
})

export default blogsRouter
