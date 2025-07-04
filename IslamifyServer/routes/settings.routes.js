import { Router } from "express";
import {
	getSettings,
	updateSettings,
} from "../controllers/settings.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = Router();

router.get("/", protectRoute, getSettings);
router.put("/", protectRoute, updateSettings);

export default router;
