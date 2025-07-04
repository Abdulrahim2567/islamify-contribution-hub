import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middleware/asyncWrapper.js";
import Contribution from "../models/contribution.model.js"; // Your Mongoose model
import { createCustomError } from "../errors/custom-error.js"; // Assuming you have this

// Get all contributions
const getContributions = asyncWrapper(async (req, res) => {
	const contributions = await Contribution.find({});
	res.status(StatusCodes.OK).json(contributions);
});

// Get all contributions for a specific member
const getContributionsByMember = asyncWrapper(async (req, res, next) => {
	const memberId = Number(req.params.memberId);
	if (!memberId) {
		return next(
			createCustomError("Member ID is required", StatusCodes.BAD_REQUEST)
		);
	}
	const contributions = await Contribution.find({ memberId });
	res.status(StatusCodes.OK).json(contributions);
});

// Add a contribution
const addContribution = asyncWrapper(async (req, res, next) => {
	const contributionData = req.body;

	if (!contributionData) {
		return next(
			createCustomError(
				"Contribution data is required",
				StatusCodes.BAD_REQUEST
			)
		);
	}

	// Optionally validate required fields here

	const contribution = new Contribution(contributionData);
	await contribution.save();
	res.status(StatusCodes.CREATED).json(contribution);
});

// Update a contribution by id
const updateContribution = asyncWrapper(async (req, res, next) => {
	const contributionId = req.params.id;
	const updatedData = req.body;

	if (!contributionId) {
		return next(
			createCustomError(
				"Contribution ID is required",
				StatusCodes.BAD_REQUEST
			)
		);
	}

	const updatedContribution = await Contribution.findOneAndUpdate(
		{ id: Number(contributionId) },
		updatedData,
		{ new: true, runValidators: true }
	);

	if (!updatedContribution) {
		return next(
			createCustomError("Contribution not found", StatusCodes.NOT_FOUND)
		);
	}

	res.status(StatusCodes.OK).json(updatedContribution);
});

// Delete a contribution by id
const deleteContribution = asyncWrapper(async (req, res, next) => {
	const contributionId = req.params.id;

	if (!contributionId) {
		return next(
			createCustomError(
				"Contribution ID is required",
				StatusCodes.BAD_REQUEST
			)
		);
	}

	const deleted = await Contribution.findOneAndDelete({
		id: Number(contributionId),
	});

	if (!deleted) {
		return next(
			createCustomError("Contribution not found", StatusCodes.NOT_FOUND)
		);
	}

	res.status(StatusCodes.OK).json({ message: "Contribution deleted" });
});

// Get total contributions amount for a member
const getTotalMemberContributions = asyncWrapper(async (req, res, next) => {
	const memberId = Number(req.params.memberId);

	if (!memberId) {
		return next(
			createCustomError("Member ID is required", StatusCodes.BAD_REQUEST)
		);
	}

	const contributions = await Contribution.find({ memberId });

	const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);

	res.status(StatusCodes.OK).json({ memberId, totalAmount });
});

// Get total contributions amount overall
const getTotalContributions = asyncWrapper(async (req, res) => {
	const contributions = await Contribution.find({});
	const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
	res.status(StatusCodes.OK).json({ totalAmount });
});

export {
	getContributions,
	getContributionsByMember,
	addContribution,
	updateContribution,
	deleteContribution,
	getTotalMemberContributions,
	getTotalContributions,
};
