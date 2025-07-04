import asyncWrapper from "../middleware/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";
import AdminActivityLog from "../models/adminActivity.model.js";
import MemberLoanActivity from "../models/memberLoanActivity.model.js";
import ContributionRecordActivity from "../models/contributionActivity.model.js";

// Save a new admin activity
export const saveAdminActivity = asyncWrapper(async (req, res) => {
	const activity = await AdminActivityLog.create(req.body);
	res.status(StatusCodes.CREATED).json(activity);
});

export const getAdminActivities = asyncWrapper(async (req, res) => {
	const activities = await AdminActivityLog.find({});
	res.status(StatusCodes.OK).json(activities);
});

export const clearAdminActivities = asyncWrapper(async (req, res) => {
	await AdminActivityLog.deleteMany({});
	res.status(StatusCodes.NO_CONTENT).send();
});

// Member loan activities
export const saveMemberLoanActivity = asyncWrapper(async (req, res) => {
	const activity = await MemberLoanActivity.create(req.body);
	res.status(StatusCodes.CREATED).json(activity);
});

export const getMemberLoanActivities = asyncWrapper(async (req, res) => {
	const { memberId } = req.query;
	const filter = memberId ? { memberId: Number(memberId) } : {};
	const activities = await MemberLoanActivity.find(filter);
	res.status(StatusCodes.OK).json(activities);
});

export const clearMemberLoanActivities = asyncWrapper(async (req, res) => {
	await MemberLoanActivity.deleteMany({});
	res.status(StatusCodes.NO_CONTENT).send();
});

// Contribution record activities
export const saveContributionActivity = asyncWrapper(async (req, res) => {
	const activity = await ContributionRecordActivity.create(req.body);
	res.status(StatusCodes.CREATED).json(activity);
});

export const getContributionActivities = asyncWrapper(async (req, res) => {
	const { memberId } = req.query;
	const filter = memberId ? { memberId: Number(memberId) } : {};
	const activities = await ContributionRecordActivity.find(filter);
	res.status(StatusCodes.OK).json(activities);
});

export const clearContributionActivities = asyncWrapper(async (req, res) => {
	await ContributionRecordActivity.deleteMany({});
	res.status(StatusCodes.NO_CONTENT).send();
});
