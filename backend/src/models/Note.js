import mongoose from "mongoose";

// 1st step: You need to create a schema
// 2nd step: You would create a model based off of that schema

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
