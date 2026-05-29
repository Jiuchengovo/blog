import Like from "../models/Like.js";
import Post from "../models/Post.js";

export const toggle = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existing = await Like.findOne({ user: userId, post: postId });

    if (existing) {
      await existing.deleteOne();
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();
      return res.json({ liked: false, likesCount: post.likesCount });
    }

    await Like.create({ user: userId, post: postId });
    post.likesCount += 1;
    await post.save();

    res.json({ liked: true, likesCount: post.likesCount });
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const liked = await Like.exists({ user: userId, post: postId });
    const post = await Post.findById(postId).select("likesCount");

    res.json({
      liked: !!liked,
      likesCount: post?.likesCount ?? 0,
    });
  } catch (err) {
    next(err);
  }
};
