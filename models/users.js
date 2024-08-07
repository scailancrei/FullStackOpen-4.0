import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,
  passwordHash: String,
  username: {
    type: String,
    unique: true,
    required: true,
  },
})

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  },
})
userSchema.set("toObject", {
  transform: (document, returnedObject) => {
    delete returnedObject.username
    delete returnedObject.name
    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model("User", userSchema)
