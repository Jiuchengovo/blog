import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: String,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
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

interactionSchema.index(
  { user: 1, targetId: 1, targetType: 1, type: 1 },
  { unique: true }
);

export default mongoose.model("Interaction", interactionSchema);
