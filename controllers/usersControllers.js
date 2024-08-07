import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/users.js"

const userRouter = express.Router()

userRouter.post("/", async (req, res) => {
  const { password, name, username } = req.body
  console.log(req.body)
  const passwordHash = await bcrypt.hash(password, 1)

  const user = new User({
    name,
    passwordHash,
    username,
  })

  const userSaved = await user.save()

  res.status(201).json(userSaved)
})

userRouter.get("/", async (req, res) => {
  const users = await User.find()
  res.status(200).json(users)
})

userRouter.delete("/", async (req, res) => {
  await User.deleteMany()
  res.status(204).end()
})

export default userRouter
