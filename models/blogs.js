import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, " is required"] },
  author: String,
  url: { type: String, required: [true, "url is required"] },
  likes: {
    type: Number,
    default: 0,
  },
})

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model("Blog", blogSchema)
