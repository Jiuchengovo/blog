import { Router } from "express";
import { toggleInteraction, getStatus } from "../controllers/likeController.js";
import auth, { softAuth } from "../middlewares/auth.js";

const router = Router();

// New generic routes: targetId can be post slug or comment ID
router.post("/:targetId/toggle", auth, toggleInteraction);
router.get("/:targetId/status", softAuth, getStatus);

export default router;
