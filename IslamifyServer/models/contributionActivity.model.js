import mongoose from "mongoose";

const contributionActivitySchema = new mongoose.Schema({
	memberId: { type: String, required: true },
	memberName: { type: String, required: true },
	amount: { type: Number, required: true },
	description: { type: String, required: true },
	addedBy: { type: String, required: true },
	editedBy: { type: String },
	type: { type: String, default: "contribution" },
});

const ContributionRecordActivity = mongoose.model(
	"ContributionRecordActivity",
	contributionActivitySchema
);

export default ContributionRecordActivity;
