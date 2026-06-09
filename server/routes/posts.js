import { Router } from "express";
import { getAll, getBySlug, create, update, remove, search } from "../controllers/postController.js";
import admin from "../middlewares/admin.js";

const router = Router();

router.get("/search", search);
router.get("/", getAll);
router.get("/:slug", getBySlug);
router.post("/", admin, create);
router.patch("/:slug", admin, update);
router.delete("/:slug", admin, remove);

export default router;
