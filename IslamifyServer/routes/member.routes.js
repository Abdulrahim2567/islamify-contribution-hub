import { Router } from "express";
import {
	getAllMembers,
	getMemberById,
	deleteMemberById,
	updateMemberInfo,
} from "../controllers/members.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = Router();

router.get("/", protectRoute, getAllMembers);
router.get("/:id", protectRoute, getMemberById);
router.patch("/:id", protectRoute, updateMemberInfo);
router.delete("/:id", protectRoute, deleteMemberById);

export default router;
