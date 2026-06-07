import Interaction from "../models/Like.js";

export const toggleInteraction = async (req, res, next) => {
  try {
    const { targetId } = req.params;
    const { type, targetType = "post" } = req.body;
    const userId = req.user.id;

    if (!["like", "favorite"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'like' or 'favorite'" });
    }

    if (!["post", "comment"].includes(targetType)) {
      return res.status(400).json({ message: "targetType must be 'post' or 'comment'" });
    }

    // "favorite" only applies to posts
    if (type === "favorite" && targetType !== "post") {
      return res.status(400).json({ message: "Favorite is only supported for posts" });
    }

    const existing = await Interaction.findOne({
      user: userId,
      targetId,
      targetType,
      type,
    });

    if (existing) {
      await existing.deleteOne();
      const count = await Interaction.countDocuments({ targetId, targetType, type });
      return res.json({ active: false, count });
    }

    await Interaction.create({ user: userId, targetId, targetType, type });
    const count = await Interaction.countDocuments({ targetId, targetType, type });

    res.json({ active: true, count });
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (req, res, next) => {
  try {
    const { targetId } = req.params;
    const targetType = req.query.targetType || "post";
    const userId = req.user?.id;

    const [likesCount, favoritesCount, liked, favorited] = await Promise.all([
      Interaction.countDocuments({ targetId, targetType, type: "like" }),
      targetType === "post"
        ? Interaction.countDocuments({ targetId, targetType, type: "favorite" })
        : Promise.resolve(0),
      userId
        ? Interaction.exists({ user: userId, targetId, targetType, type: "like" })
        : Promise.resolve(false),
      userId && targetType === "post"
        ? Interaction.exists({ user: userId, targetId, targetType, type: "favorite" })
        : Promise.resolve(false),
    ]);

    res.json({
      likesCount,
      favoritesCount: targetType === "post" ? favoritesCount : undefined,
      liked: !!liked,
      favorited: targetType === "post" ? !!favorited : undefined,
    });
  } catch (err) {
    next(err);
  }
};
