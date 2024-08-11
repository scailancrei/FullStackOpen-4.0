import { test, after, beforeEach, describe } from "node:test"
import assert from "node:assert"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import supertest from "supertest"
import { blogs } from "./test_helper.js"
import User from "../models/users.js"
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

describe("Login and get tokens", () => {
  test("Get token on login", async () => {
    const user = { username: "Juan Antonio", password: "juan_password" }
    const response = await api
      .post("/api/login")
      .set("authorization", "Bearer")
      .send(user)
      .expect(200)

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET)
    assert.strictEqual(decodedToken.username, user.username)
  })
})
describe("Manage for blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("blogs expect to have an id", async () => {
    let id = "5a422a851b54a676234d17f7"
    const response = await api
      .get(`/api/blogs/${id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    console.log(response.body)
    assert.deepEqual(response.body.id, id)
  })

  test("fails if blog doesn't exist with status 400", async () => {
    let id = 434782
    await api.get(`/api/blogs/${id}`).expect(400)
  })
  test("Blogs are saved correctly and expects to have 3 blogs on the list", async () => {
    const user = { username: "Juan Antonio", password: "juan_password" }
    const response = await api.post("/api/login").send(user).expect(200)

    await api
      .post(`/api/blogs`)
      .set("authorization", "Bearer " + response.body.token)
      .send(blogs[3])
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const actualData = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    assert.strictEqual(actualData.body.length, 3)
  })

  test("Blog has 0 likes as default property", async () => {
    const newUser = {
      username: "newUser",
      name: "user",
      password: "password123",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const userToken = await api
      .post("/api/login")
      .send({ username: "newUser", password: "password123" })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const newBlog = {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      __v: 0,
    }

    const result = await api
      .post("/api/blogs")
      .set("authorization", "Bearer " + userToken.body.token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    assert.strictEqual(result.body.likes, 0)
  })

  test("Blog has not url and title properties", async () => {
    const newBlog = {
      _id: "5a422b3a1b54a676234d17f9",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    }
    const userToken = await api
      .post("/api/login")
      .send({ username: "Juan Antonio", password: "juan_password" })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const result = await api
      .post("/api/blogs")
      .set("authorization", "bearer " + userToken.body.token)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    assert.strictEqual(result.status, 400)
  })

  test("Blog has been deleted correctly", async () => {
    const blogList = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const userToken = await await api
      .post("/api/login")
      .send({ username: "Juan Antonio", password: "juan_password" })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const decodedToken = await jwt.verify(
      userToken.body.token,
      process.env.SECRET
    )
    blogList.body[0].user = decodedToken.id
    const result = await api
      .delete(`/api/blogs`)
      .set("authorization", "bearer " + userToken.body.token)
      .send(blogList.body[0])
      .expect(204)
    assert.strictEqual(result.status, 204)
  })

  test("A blog is updated correctly with 15 likes", async () => {
    const list = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    list.body[0].likes = 15

    const userToken = await await api
      .post("/api/login")
      .send({ username: "Juan Antonio", password: "juan_password" })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const result = await api
      .put(`/api/blogs/${list.body[0].id}`)
      .set("authorization", "bearer " + userToken.body.token)
      .send(list.body[0])
      .expect(200)
      .expect("Content-Type", /application\/json/)

    assert.strictEqual(result.body.likes, 15)
  })
})

describe("Testing Users", () => {
  test("User is saved with credentials", async () => {
    await User.deleteMany({})

    const user = {
      username: "Juan Antonio",
      name: "juan",
      password: "juan_password",
    }

    const response = await api
      .post(`/api/users`)
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    assert.deepEqual(response.body.username, user.username)
  })
  test("Users are returned as JSON", async () => {
    const response = await api.get(`/api/users`).expect(200)

    assert.strictEqual(response.body.length, 1)
  })
})

test("Save a blog without token of user", async () => {
  const result = await api
    .post(`/api/blogs`)
    .set("authorization", "Bearer ")
    .send(blogs[4])
    .expect(401)
    .expect("Content-Type", /application\/json/)

  assert.strictEqual(result.status, 401)
})

after(async () => {
  await mongoose.connection.close()
  logger.info("Database disconeccted")
})
