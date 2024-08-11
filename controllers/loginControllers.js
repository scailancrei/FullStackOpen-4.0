import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import express from "express"
import User from "../models/users.js"

const loginRouter = express.Router()

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({ error: "invalid user or password" })
  }

  const userToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userToken, process.env.SECRET, { expiresIn: 60 * 60 })

  res.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter
