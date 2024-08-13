import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/users.js"

const userRouter = express.Router()

userRouter.get("/", async (req, res) => {
  const users = await User.find({})

  if (users.length === 0) {
    res.status(404).json({ message: "no data found" })
  }
  res.json(users.map((e) => e.toJSON()))
})

userRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body

  if (!password) {
    return res.status(400).json({ error: "Password is missing" })
  }
  const passwordHash = await bcrypt.hash(password, 1)

  const user = new User({
    name,
    passwordHash,
    username,
  })

  const userSaved = await user.save()

  res.status(201).json(userSaved)
})

userRouter.delete("/", async (req, res) => {
  const result = await User.deleteMany()
  res.status(204).send(result)
})

export default userRouter
