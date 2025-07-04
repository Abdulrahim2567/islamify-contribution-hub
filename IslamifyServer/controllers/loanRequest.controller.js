import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../middleware/asyncWrapper.js";
import LoanRequest from "../models/loanRequest.model.js";
import createCustomError from "../errors/custom-error.js";

// Create new loan request
const addLoanRequest = asyncWrapper(async (req, res, next) => {
	const loanRequestData = req.body;
	if (!loanRequestData) {
		return next(
			createCustomError(
				"Loan request data is required",
				StatusCodes.BAD_REQUEST
			)
		);
	}
	const loanRequest = new LoanRequest(loanRequestData);
	await loanRequest.save();
	res.status(StatusCodes.CREATED).json(loanRequest);
});

// Get all loan requests (optionally by memberId)
const getLoanRequests = asyncWrapper(async (req, res) => {
	const { memberId, status, startDate, endDate } = req.query;

	let filter = {};

	if (memberId) filter.memberId = Number(memberId);
	if (status) filter.status = status;

	if (startDate && endDate) {
		filter.requestDate = {
			$gte: new Date(startDate).toISOString(),
			$lte: new Date(endDate).toISOString(),
		};
	}

	const loanRequests = await LoanRequest.find(filter);
	res.status(StatusCodes.OK).json(loanRequests);
});

// Get single loan request by id
const getLoanRequestById = asyncWrapper(async (req, res, next) => {
	const loanRequest = await LoanRequest.findOne({ id: req.params.id });
	if (!loanRequest) {
		return next(
			createCustomError("Loan request not found", StatusCodes.NOT_FOUND)
		);
	}
	res.status(StatusCodes.OK).json(loanRequest);
});

// Update loan request by id
const updateLoanRequest = asyncWrapper(async (req, res, next) => {
	const updatedRequest = await LoanRequest.findOneAndUpdate(
		{ id: req.params.id },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!updatedRequest) {
		return next(
			createCustomError("Loan request not found", StatusCodes.NOT_FOUND)
		);
	}
	res.status(StatusCodes.OK).json(updatedRequest);
});

// Delete loan request by id
const deleteLoanRequest = asyncWrapper(async (req, res, next) => {
	const deleted = await LoanRequest.findOneAndDelete({ id: req.params.id });
	if (!deleted) {
		return next(
			createCustomError("Loan request not found", StatusCodes.NOT_FOUND)
		);
	}
	res.status(StatusCodes.OK).json({ message: "Loan request deleted" });
});

// Get total loan amount (optionally filtered by memberId)
const getTotalLoanAmount = asyncWrapper(async (req, res) => {
	const { memberId } = req.query;
	let filter = {};
	if (memberId) filter.memberId = Number(memberId);

	const loanRequests = await LoanRequest.find(filter);
	const totalAmount = loanRequests.reduce(
		(total, req) => total + req.amount,
		0
	);

	res.status(StatusCodes.OK).json({ totalAmount });
});

// Get loan requests by status (pending, approved, rejected) optionally filtered by memberId
const getLoanRequestsByStatus = asyncWrapper(async (req, res) => {
	const { status, memberId } = req.query;

	if (!status) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: "Status query param required" });
	}

	let filter = { status };

	if (memberId) filter.memberId = Number(memberId);

	const loanRequests = await LoanRequest.find(filter);
	res.status(StatusCodes.OK).json(loanRequests);
});

export {
	addLoanRequest,
	getLoanRequests,
	getLoanRequestById,
	updateLoanRequest,
	deleteLoanRequest,
	getTotalLoanAmount,
	getLoanRequestsByStatus,
};
