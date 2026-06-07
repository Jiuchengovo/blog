import Post from "../models/Post.js";

export const getAll = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 }).select("-content");
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({ posts: [], query: q || "" });
    }

    // Use MongoDB text search with fallback to regex for partial matches
    const results = await Post.find(
      { $text: { $search: q.trim() } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(Number(limit))
      .select("-content")
      .lean();

    // If text search returns few results, supplement with regex on title/tags
    if (results.length < 3) {
      const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const extraResults = await Post.find({
        _id: { $nin: results.map((r) => r._id) },
        $or: [{ title: regex }, { excerpt: regex }, { tags: regex }],
      })
        .sort({ date: -1 })
        .limit(Number(limit) - results.length)
        .select("-content")
        .lean();

      results.push(...extraResults);
    }

    res.json({ posts: results, query: q.trim() });
  } catch (err) {
    next(err);
  }
};
