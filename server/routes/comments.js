import { Router } from "express";
import { getByPost, create, remove } from "../controllers/commentController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/post/:postSlug", getByPost);
router.post("/post/:postSlug", auth, create);
router.delete("/:id", auth, remove);

export default router;
