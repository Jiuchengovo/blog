import { Router } from "express";
import { getAll, getBySlug, create, update, remove, search } from "../controllers/postController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/search", search);
router.get("/", getAll);
router.get("/:slug", getBySlug);
router.post("/", auth, create);
router.patch("/:slug", auth, update);
router.delete("/:slug", auth, remove);

export default router;
