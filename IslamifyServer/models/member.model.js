import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
	{
		avatar: { type: String, default: "default-avatar.png" },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String },
		password: { type: String, required: true, select: false },
		needsPasswordChange: { type: Boolean, default: true },
		registrationFee: { type: Number, default: 0 },
		totalContributions: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
		loanEligible: { type: Boolean, default: false },
		canApplyForLoan: { type: Boolean, default: false },
		role: {
			type: String,
			enum: ["admin", "member"],
			default: "member",
		},
		readNotifications: { type: [String], default: [] },
	},
	{ timestamps: true }
);

export default mongoose.model("Member", MemberSchema);
