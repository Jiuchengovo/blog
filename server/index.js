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

// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  next();
});

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

  // Migrate old Interaction documents & indexes
  try {
    const interactions = await import("mongoose").then((m) =>
      m.default.connection.db.collection("interactions")
    );

    // 1. Rename postSlug → targetId, add targetType for old documents
    const result = await interactions.updateMany(
      { targetType: { $exists: false } },
      { $rename: { postSlug: "targetId" }, $set: { targetType: "post" } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Migrated ${result.modifiedCount} interaction(s) to new schema`);
    }

    // 2. Drop old unique index (user + postSlug + type) if it still exists
    const indexes = await interactions.indexes();
    const oldIndex = indexes.find((idx) => idx.name === "user_1_postSlug_1_type_1");
    if (oldIndex) {
      await interactions.dropIndex("user_1_postSlug_1_type_1");
      console.log("Dropped old index: user_1_postSlug_1_type_1");
    }

    // 3. Ensure new compound unique index exists
    const newIndexExists = indexes.some((idx) => idx.name === "user_1_targetId_1_targetType_1_type_1");
    if (!newIndexExists) {
      await interactions.createIndex(
        { user: 1, targetId: 1, targetType: 1, type: 1 },
        { unique: true }
      );
      console.log("Created new index: user_1_targetId_1_targetType_1_type_1");
    }
  } catch {}

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
