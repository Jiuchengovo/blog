import { Router } from "express";
import { register, login, getMe, updateProfile, changePassword } from "../controllers/authController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.patch("/me", auth, updateProfile);
router.patch("/password", auth, changePassword);

export default router;
