import { test, describe } from "node:test"
import assert from "node:assert"
import listHelper from "../utils/list_helpers.js"
import blogs from "./test_helper.js"

describe("Testing blogs", () => {
  test("Result of total likes", () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test("Return only number 1", () => {
    assert.strictEqual(listHelper.dummy(blogs), 1)
  })

  test("Return the object with max number of likes", () => {
    const result = listHelper.favouriteBlog(blogs)
    assert.deepStrictEqual(result[0], {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    })
  })

  test("Return the author with most blogs", () => {
    const result = listHelper.mostBlog(blogs)
    assert.deepStrictEqual(result, { autor: "Robert C. Martin", blog: 3 })
  })

  test("Author with more likes", () => {
    const result = listHelper.authorMostLiked(blogs)
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 })
  })
})
