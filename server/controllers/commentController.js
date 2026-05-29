import Comment from "../models/Comment.js";

export const getByPost = async (req, res, next) => {
  try {
    const { postSlug } = req.params;

    const comments = await Comment.find({ postSlug })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { postSlug } = req.params;
    const { content, parent } = req.body;

    const comment = await Comment.create({
      postSlug,
      author: req.userId,
      content,
      parent: parent || null,
    });

    const populated = await comment.populate("author", "username avatar");

    res.status(201).json({ comment: populated });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};
