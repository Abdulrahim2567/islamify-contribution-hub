import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middleware/asyncWrapper.js";
import Settings from "../models/settings.model.js";

// Default fallback (optional but useful)
const defaultSettings = {
	associationName: "Islamify",
	registrationFee: 5000,
	maxLoanMultiplier: 3,
	minimumContributionAmount: 30000,
	loanEligibilityThreshold: 300000,
};

// GET settings
const getSettings = asyncWrapper(async (req, res) => {
	let settings = await Settings.findOne();
	if (!settings) {
		// If no settings exist, create with default values
		settings = await Settings.create(defaultSettings);
	}
	res.status(StatusCodes.OK).json(settings);
});

// UPDATE or create settings
const updateSettings = asyncWrapper(async (req, res) => {
	const body = req.body;

	const updated = await Settings.findOneAndUpdate(
		{},
		{ ...body },
		{ new: true, upsert: true, runValidators: true }
	);

	res.status(StatusCodes.OK).json(updated);
});

export { getSettings, updateSettings };
