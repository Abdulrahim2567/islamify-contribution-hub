import Member from "../models/member.model.js"; // <-- updated import
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middleware/asyncWrapper.js";
import { createCustomError } from "../errors/custom-error.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// Register new member
const signup = asyncWrapper(async (req, res, next) => {
	const {name, email, phone, role, generatedPassword, registrationFee } =
		req.body;

	if (
		(!name || !email || !phone || !role || !generatedPassword,
		!registrationFee)
	)
		return next(
			createCustomError(
				"Incomplete information",
				StatusCodes.UNPROCESSABLE_ENTITY
			)
		);

	const existingMember = await Member.findOne({ email });
	if (existingMember)
		return next(
			createCustomError("Email already registered", StatusCodes.CONFLICT)
		);

	const hashedPassword = await bcrypt.hash(generatedPassword, 10);

	const member = new Member({
		name,
		email,
		phone,
		password: hashedPassword,
		role,
		registrationFee,
	});

	await member.save();
	generateTokenAndSetCookie(member._id, res);
	const { password, ...userData } = member.toObject();
	res.status(StatusCodes.CREATED).json({
		message: "Success",
		data: userData,
	});
});

// Login
const login = asyncWrapper(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password)
		return next(
			createCustomError(
				"Incomplete credentials",
				StatusCodes.UNPROCESSABLE_ENTITY
			)
		);

	const member = await Member.findOne({ email }).select("+password");
	if (!member)
		return next(
			createCustomError("Member not found", StatusCodes.NOT_FOUND)
		);

	const isMatch = await bcrypt.compare(password, member.password);
	if (!isMatch)
		return next(
			createCustomError("Incorrect password", StatusCodes.UNAUTHORIZED)
		);

	generateTokenAndSetCookie(member._id, res);
	const { password: p, ...userData } = member.toObject();

	res.status(StatusCodes.OK).json({
		message: "Login successful",
		data: userData,
	});
});

// Logout
const logout = asyncWrapper(async (req, res) => {
	res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
	res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
});

export { signup, login, logout };
