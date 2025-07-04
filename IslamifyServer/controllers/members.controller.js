import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middleware/asyncWrapper.js";
import Member from "../models/member.model.js"; // Assuming your schema is ready
import bcrypt from "bcryptjs";

// GET all members
const getAllMembers = asyncWrapper(async (req, res) => {
	const members = await Member.find().select("-password");
	res.status(StatusCodes.OK).json(members);
});

// GET member by ID
const getMemberById = asyncWrapper(async (req, res, next) => {
	const { id } = req.params;
	const member = await Member.findById(id).select("-password");
	if (!member)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "Member not found" });

	res.status(StatusCodes.OK).json(member);
});

// DELETE member by ID
const deleteMemberById = asyncWrapper(async (req, res) => {
	const { id } = req.params;
	await Member.findByIdAndDelete(id);
	res.status(StatusCodes.OK).json({ message: "Member deleted" });
});

// UPDATE member info
const updateMemberInfo = asyncWrapper(async (req, res, next) => {
	const { id } = req.params;
	const updates = { ...req.body };

	console.log("Received updates:", updates);
	

	if (updates.password) {
		const hashed = await bcrypt.hash(updates.password, 10);
		updates.password = hashed;
	}

	const updated = await Member.findByIdAndUpdate(id, updates, {
		new: true,
		runValidators: true,
	}).select("-password");

	if (!updated) {
		// Explicitly return 404 if not found
		return res.status(StatusCodes.NOT_FOUND).json({
			message: "User not found",
		});
	}

	res.status(StatusCodes.OK).json(updated);
});


// UPDATE role

export {
	getAllMembers,
	getMemberById,
	deleteMemberById,
	updateMemberInfo,
};
