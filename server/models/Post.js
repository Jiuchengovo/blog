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

// Text index for full-text search
postSchema.index({ title: "text", excerpt: "text", tags: "text", content: "text" });

export default mongoose.model("Post", postSchema);
