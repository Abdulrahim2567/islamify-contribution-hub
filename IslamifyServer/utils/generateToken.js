import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, res) => {
	const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	const isDev = process.env.NODE_ENV === "development";

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: "lax", // ✅ Allow cookies on same-site navigation from 8080 → 9000
		secure: false, // ✅ For localhost (only use true in HTTPS production)
	});
};

export default generateTokenAndSetCookie;
