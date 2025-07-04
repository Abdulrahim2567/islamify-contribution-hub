import { Router } from "express";
import { login, signup, logout } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router 