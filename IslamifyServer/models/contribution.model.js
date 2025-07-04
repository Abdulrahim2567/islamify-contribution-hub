import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
	memberId: { type: String, required: true },
	amount: { type: Number, required: true },
	description: { type: String, required: true },
	addedBy: { type: String, required: true },
	editedBy: { type: String }, // Optional
	type: {
		type: String,
		required: true,
		enum: ["contribution"],
		default: "contribution",
	},
});

// Optionally, add indexes if needed, e.g., on memberId

const Contribution = mongoose.model("Contribution", contributionSchema);

export default Contribution;
