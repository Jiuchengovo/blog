import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["https://jiuchengovo.me", "https://www.jiuchengovo.me", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

const start = async () => {
  await connectDB();

  // Migrate old Interaction documents: postSlug → targetId + targetType
  try {
    const interactions = await import("mongoose").then((m) =>
      m.default.connection.db.collection("interactions")
    );
    const result = await interactions.updateMany(
      { targetType: { $exists: false } },
      { $rename: { postSlug: "targetId" }, $set: { targetType: "post" } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Migrated ${result.modifiedCount} interaction(s) to new schema`);
    }
  } catch {}

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
