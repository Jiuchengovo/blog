import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postSlug: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["like", "favorite"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interactionSchema.index({ user: 1, postSlug: 1, type: 1 }, { unique: true });

export default mongoose.model("Interaction", interactionSchema);
