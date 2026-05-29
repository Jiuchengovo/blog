import Interaction from "../models/Like.js";

export const toggleInteraction = async (req, res, next) => {
  try {
    const { postSlug } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    if (!["like", "favorite"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'like' or 'favorite'" });
    }

    const existing = await Interaction.findOne({ user: userId, postSlug, type });

    if (existing) {
      await existing.deleteOne();
      const count = await Interaction.countDocuments({ postSlug, type });
      return res.json({ active: false, count });
    }

    await Interaction.create({ user: userId, postSlug, type });
    const count = await Interaction.countDocuments({ postSlug, type });

    res.json({ active: true, count });
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (req, res, next) => {
  try {
    const { postSlug } = req.params;
    const userId = req.user?.id;

    const [likesCount, favoritesCount, liked, favorited] = await Promise.all([
      Interaction.countDocuments({ postSlug, type: "like" }),
      Interaction.countDocuments({ postSlug, type: "favorite" }),
      userId
        ? Interaction.exists({ user: userId, postSlug, type: "like" })
        : Promise.resolve(false),
      userId
        ? Interaction.exists({ user: userId, postSlug, type: "favorite" })
        : Promise.resolve(false),
    ]);

    res.json({
      likesCount,
      favoritesCount,
      liked: !!liked,
      favorited: !!favorited,
    });
  } catch (err) {
    next(err);
  }
};
