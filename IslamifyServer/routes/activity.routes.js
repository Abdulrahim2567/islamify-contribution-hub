import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
	saveAdminActivity,
	getAdminActivities,
	clearAdminActivities,
	saveMemberLoanActivity,
	getMemberLoanActivities,
	clearMemberLoanActivities,
	saveContributionActivity,
	getContributionActivities,
	clearContributionActivities,
} from "../controllers/activity.controller.js";

const router = Router();

// Admin
router.post("/admin", protectRoute, saveAdminActivity);
router.get("/admin", protectRoute, getAdminActivities);
router.delete("/admin", protectRoute, clearAdminActivities);

// Loans
router.post("/loan", protectRoute, saveMemberLoanActivity);
router.get("/loan", protectRoute, getMemberLoanActivities);
router.delete("/loan", protectRoute, clearMemberLoanActivities);

// Contributions
router.post("/contribution", protectRoute, saveContributionActivity);
router.get("/contribution", protectRoute, getContributionActivities);
router.delete("/contribution", protectRoute, clearContributionActivities);

export default router;
