import express from "express"
import cors from "cors"
import morgan from "morgan"

const app = express()

app.use(cors())
app.use(morgan("tiny"))

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
