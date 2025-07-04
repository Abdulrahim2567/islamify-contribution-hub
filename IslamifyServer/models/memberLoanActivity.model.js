import mongoose from "mongoose";

const memberLoanActivitySchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ["loan_request", "loan_approval", "loan_rejection"],
		required: true,
	},
	amount: { type: Number, required: true },
	memberId: { type: String, required: true },
	memberName: { type: String, required: true },
	performedBy: { type: String, required: true },
	description: { type: String },
});

const MemberLoanActivity = mongoose.model(
	"MemberLoanActivity",
	memberLoanActivitySchema
);

export default MemberLoanActivity;
