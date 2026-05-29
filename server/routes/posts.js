import { Router } from "express";
import { getAll, getBySlug, create, update, remove } from "../controllers/postController.js";

const router = Router();

router.get("/", getAll);
router.get("/:slug", getBySlug);
router.post("/", create);
router.patch("/:slug", update);
router.delete("/:slug", remove);

export default router;
