import { Router } from "express";
import { toggle, getStatus } from "../controllers/likeController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/:postId/toggle", auth, toggle);
router.get("/:postId/status", auth, getStatus);

export default router;
