import { test, after, beforeEach } from "node:test"
import assert from "node:assert"
import mongoose from "mongoose"
import supertest from "supertest"
import { blogs } from "./test_helper.js"
import app from "../index.js"
import Blog from "../models/blogs.js"
import logger from "../utils/logger.js"

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogsList = new Blog(blogs[0])
  await blogsList.save()
  blogsList = new Blog(blogs[1])
  await blogsList.save()
})

test("blogs are returned as json", async () => {
  const data = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
  console.log(data.body)
})

test("blogs expect to have an id", async () => {
  let id = "5a422a851b54a676234d17f7"
  const response = await api
    .get(`/api/blogs/${id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)

  assert.deepEqual(response.body.id, id)
})

test("Blogs are saved correctly", async () => {
  await api
    .post(`/api/blogs`)
    .send(blogs[3])
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const actualData = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  assert.strictEqual(actualData.body.length, 3)
})

test("Blog has not likes property", async () => {
  const newBlog = {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    __v: 0,
  }
  const result = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  assert.equal(result.body.likes, 0)
})

test("Blog has not url and title properties", async () => {
  const newBlog = {
    _id: "5a422b3a1b54a676234d17f9",

    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  }
  const result = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/)
  console.log(result.status)
  assert.strictEqual(result.status, 400)
})

test("Blog has been deleted correctly", async () => {
  const blogList = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  const result = await api
    .delete(`/api/blogs/${blogList.body[0].id}`)
    .expect(204)

  assert.strictEqual(result.status, 204)
})

test("A blog is updated correctly", async () => {
  const list = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  list.body[0].likes = 5

  const result = await api
    .put(`/api/blogs/${list.body[0].id}`)
    .send(list.body[0])
    .expect(200)
    .expect("Content-Type", /application\/json/)

  assert.strictEqual(list.body[0].likes, result.body.likes)
})

after(async () => {
  await mongoose.connection.close()
  logger.info("Database disconeccted")
})
