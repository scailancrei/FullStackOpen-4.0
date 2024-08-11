import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,
  passwordHash: {
    type: String,
    required: [true, "password is required"],
    minLength: 3,
  },
  username: {
    type: String,
    unique: true,
    minLength: 3,
    required: [true, "username is required"],
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
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
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model("User", userSchema)
