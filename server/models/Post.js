import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    date: { type: String, required: true },
    excerpt: { type: String, default: "" },
    tags: [{ type: String }],
    content: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
