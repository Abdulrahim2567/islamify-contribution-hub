import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";

import {
	getContributions,
	getContributionsByMember,
	addContribution,
	updateContribution,
	deleteContribution,
	getTotalMemberContributions,
	getTotalContributions,
} from "../controllers/contribution.controller.js";

const router = Router();

// Get all contributions
router.get("/", protectRoute, getContributions);

// Get contributions by memberId
router.get("/member/:memberId", protectRoute, getContributionsByMember);

// Add a new contribution
router.post("/", protectRoute, addContribution);

// Update a contribution by id
router.put("/:id", protectRoute, updateContribution);

// Delete a contribution by id
router.delete("/:id", protectRoute, deleteContribution);

// Get total contributions for a member
router.get(
	"/totals/member/:memberId",
	protectRoute,
	getTotalMemberContributions
);

// Get total contributions overall
router.get("/totals", protectRoute, getTotalContributions);

export default router;
