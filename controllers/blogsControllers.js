import express from "express"
import User from "../models/users.js"
import Blog from "../models/blogs.js"
import middleware from "../utils/middleware.js"

const blogsRouter = express.Router()

blogsRouter.get("/", async (request, response) => {
  const data = await Blog.find({}).populate("user", { blogs: 0 })

  if (data.length > 0) {
    response.status(200).json(data)
  } else {
    response.status(204).json({ error: "No blogs in bbdd" })
  }
})

blogsRouter.get("/:id", async (req, res) => {
  const id = req.params.id
  const blog = await Blog.findById(id)
  if (blog) {
    res.status(200).json(blog)
  } else {
    res.status(404).json({ error: "Blog not found" })
  }
})

blogsRouter.post("/", middleware.getUserExtractor, async (req, res) => {
  const body = req.body

  let user = req.user

  if (!user || !user.id) {
    return res.status(401).json({ error: "token missing or invalid" })
  }

  if (!body.title || !body.url) {
    res.status(400).json({ error: "URL or Title is missing" })
  }

  const userBlog = await User.findById(user.id)

  if (!userBlog) {
    res.status(404).json({ error: "user not found" })
  }
  const blog = await new Blog({
    _id: body._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: userBlog.id,
  })

  const blogSaved = await blog.save()

  userBlog.blogs = userBlog.blogs.concat(blogSaved.id)
  await userBlog.save()

  res.status(201).json(blogSaved)
})

blogsRouter.delete("/:id", middleware.getUserExtractor, async (req, res) => {
  const id = req.params.id

  let user = req.user

  if (!user || !user.id) {
    res.status(403).send("Token invalid or missing")
  }

  const blog = await Blog.findById(id)
  if (!blog) {
    res.status(404).json({ error: "impossible to delete, blog not found" })
  }

  if (!blog.user) {
    blog.user = user.id
  }

  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndDelete(blog.id)
    res.status(204).send("Element deleted")
  } else {
    let usernameBlog = await User.findOne({ blogs: blog.id })
    res
      .status(401)
      .json({ error: `Only ${usernameBlog.username} can delete this blog ` })
  }
})

blogsRouter.put("/:id", middleware.getUserExtractor, async (req, res) => {
  const { id } = req.params
  const likes = req.body.likes
  const user = req.user

  if (!user || !user.id) {
    res.status(401).send("Token invalid or missing")
  }

  const result = await Blog.findByIdAndUpdate(
    id,
    { likes: likes },
    { new: true }
  )

  res.status(200).json(result)
})

export default blogsRouter
