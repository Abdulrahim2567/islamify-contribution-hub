import mongoose from "mongoose";

const loanRequestSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true }, // unique identifier (string)
	dueDate: { type: String },
	paymentInterval: { type: String },
	paymentIntervalAmount: { type: Number },
	nextPaymentDate: { type: String },
	nextPaymentAmount: { type: Number },
	memberId: { type: Number, required: true },
	memberName: { type: String, required: true },
	amount: { type: Number, required: true },
	purpose: { type: String, required: true },
	status: {
		type: String,
		enum: ["pending", "approved", "rejected"],
		default: "pending",
		required: true,
	},
	processedBy: { type: String },
	processedDate: { type: String },
});

const LoanRequest = mongoose.model("LoanRequest", loanRequestSchema);

export default LoanRequest;
