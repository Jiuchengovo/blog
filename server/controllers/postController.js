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
