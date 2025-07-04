import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
	{
		associationName: { type: String, required: true },
		registrationFee: { type: Number, required: true },
		maxLoanMultiplier: { type: Number, required: true },
		minimumContributionAmount: { type: Number, required: true },
		loanEligibilityThreshold: { type: Number, required: true },
	},
	{ timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
