import { Router } from "express";
import { toggleInteraction, getStatus } from "../controllers/likeController.js";
import auth, { softAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/:postSlug/toggle", auth, toggleInteraction);
router.get("/:postSlug/status", softAuth, getStatus);

export default router;
