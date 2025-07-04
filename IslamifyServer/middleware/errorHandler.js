import { CustomAPIError } from "../errors/custom-error.js";
const customErrorHandler = (err, req, res, next) => {
	if (err instanceof CustomAPIError) {
		return res.status(err.statusCode).json({ message: err.message });
	}
	console.log(err);
	return res.status(500).json({
		message: "Internal Server Error! Your request could not be processed.",
	});
};

export default customErrorHandler;
