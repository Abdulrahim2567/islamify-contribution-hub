import jwt from "jsonwebtoken";
import asyncWrapper from "./asyncWrapper.js";
import { createCustomError } from "../errors/custom-error.js";
import { StatusCodes } from "http-status-codes";
import Member from "../models/member.model.js";

const protectRoute = asyncWrapper(async (req, res, next) => {
	let token = req.cookies?.jwt;

	console.log("Incoming cookies:", req.cookies);
	console.log("Raw cookie header:", req.headers.cookie);


	// Fallback: extract from raw cookie header
	if (!token && req.headers.cookie) {
		const cookies = req.headers.cookie
			.split(";")
			.map((cookie) => cookie.trim());
		const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));
		if (jwtCookie) {
			token = jwtCookie.split("=")[1];
		}
	}

	if (!token) {
		console.log("No token found in cookies or headers");
		
		return next(
			createCustomError("No Token Provided", StatusCodes.UNAUTHORIZED)
		);
	}

	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("Decoded JWT:", decoded);
		
	} catch (error) {
		return next(
			createCustomError(
				"Invalid or Expired Token",
				StatusCodes.UNAUTHORIZED
			)
		);
	}

	const member = await Member.findById(decoded.userID).select("-password");

	if (!member) {
		// User no longer exists — session is invalid
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "Lax",
			secure: process.env.NODE_ENV === "production",
		});

		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "User not found. Please log in again.",
			code: "user_deleted",
		});
	}

	req.member = member;
	next();
});


export default protectRoute;
