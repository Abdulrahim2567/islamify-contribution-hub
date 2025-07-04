import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";

import {
	addLoanRequest,
	getLoanRequests,
	getLoanRequestById,
	updateLoanRequest,
	deleteLoanRequest,
	getTotalLoanAmount,
	getLoanRequestsByStatus,
} from "../controllers/loanRequest.controller.js";

const router = Router();

router.post("/", protectRoute, addLoanRequest);
router.get("/", protectRoute, getLoanRequests);
router.get("/totals", protectRoute, getTotalLoanAmount);
router.get("/status", protectRoute, getLoanRequestsByStatus);
router.get("/:id", protectRoute, getLoanRequestById);
router.put("/:id", protectRoute, updateLoanRequest);
router.delete("/:id", protectRoute, deleteLoanRequest);

export default router;
