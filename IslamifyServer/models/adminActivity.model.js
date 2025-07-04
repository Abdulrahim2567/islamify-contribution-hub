import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema({
	type: { type: String, required: true },
	text: { type: String, required: true },
	color: { type: String, required: true },
	adminName: { type: String, required: true },
	adminEmail: { type: String, required: true },
	adminRole: { type: String, enum: ["member", "admin"], required: true },
	memberId: { type: String },
	isRead: { type: Boolean, default: false },
});

const AdminActivityLog = mongoose.model(
	"AdminActivityLog",
	adminActivitySchema
);

export default AdminActivityLog;
