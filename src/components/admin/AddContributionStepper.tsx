import React, { useState, useEffect } from "react";
import {
	X,
	Check,
	ChevronLeft,
	ChevronRight,
	ArrowRight,
	ArrowLeft,
	Plus,
} from "lucide-react";
import { Member } from "../../types/types";
import { readMembersFromStorage } from "../../utils/membersStorage";
import MemberSelectStep from "./AddContributionStepper/MemberSelectStep";
import ContributionFormStep from "./AddContributionStepper/ContributionFormStep";
import { getNowString } from "@/utils/calculations";

interface AddContributionStepperProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	members: Member[]; // unused now
	onSubmit: (data: {
		memberId: number;
		amount: number;
		type: "contribution";
		date: string;
		description?: string;
	}) => void;
}

const PAGE_SIZE = 6;

const DEMO_ADMIN_EMAIL = "admin@islamify.org";

const AddContributionStepper: React.FC<AddContributionStepperProps> = ({
	open,
	onOpenChange,
	members: _propMembers, // ignore propMembers
	onSubmit,
}) => {
	const [step, setStep] = useState<1 | 2>(1);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [page, setPage] = useState(0);
	const [formData, setFormData] = useState({ amount: "", description: "" });
	const [localMembers, setLocalMembers] = useState<Member[]>([]);

	useEffect(() => {
		if (open) {
			// Only get members from localStorage. If empty, insert only demo admin.
			const freshMembers = readMembersFromStorage();
			// Only demo admin user if no other persisted members
			if (!freshMembers || freshMembers.length === 0) {
				setLocalMembers([
					{
						id: 1,
						name: "Admin User",
						email: DEMO_ADMIN_EMAIL,
						phone: "",
						registrationFee: 0,
						totalContributions: 0,
						isActive: true,
						loanEligible: false,
						joinDate: getNowString(),
						role: "admin",
						password: "",
						needsPasswordChange: false,
						canApplyForLoan: false
					},
				]);
			} else {
				setLocalMembers(freshMembers);
			}
		}
	}, [open]);

	// Only non-admins selectable for contributions
	const nonAdminMembers = localMembers.filter((m) => m.role !== "admin");
	const totalPages = Math.ceil(nonAdminMembers.length / PAGE_SIZE);

	const handleSelectMember = (member: Member) => {
		setSelectedMember(member);
	};

	const handleNext = () => {
		if (selectedMember) setStep(2);
	};

	const handleBack = () => {
		setStep(1);
	};

	const handleClose = () => {
		onOpenChange(false);
		setTimeout(() => {
			setStep(1);
			setSelectedMember(null);
			setFormData({ amount: "", description: "" });
			setPage(0);
		}, 250);
	};

	const handleFormDataChange = (data: {
		amount: string;
		description: string;
	}) => {
		setFormData(data);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedMember) return;
		onSubmit({
			memberId: selectedMember.id,
			amount: parseFloat(formData.amount),
			type: "contribution",
			date:getNowString(),
			description: formData.description || undefined,
		});
		setFormData({ amount: "", description: "" });
		setSelectedMember(null);
		setStep(1);
		setPage(0);
		onOpenChange(false);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
			<div
				className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col relative overflow-hidden"
				style={{ height: "600px" }}
			>
				{/* Close Button */}
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10"
					type="button"
					aria-label="Close"
				>
					<X size={24} />
				</button>

				{/* Header with Stepper Progress Indicator */}
				<div className="flex flex-col items-center pt-8 pb-4 px-6 border-b border-gray-100">
					<div className="w-full flex flex-col items-center">
						{/* Stepper Indicator */}
						<div
							className="relative w-full flex items-center justify-between mb-3"
							style={{ maxWidth: 270, minWidth: 250 }}
						>
							<div className="relative flex items-center w-full">
								{/* Step 1 - Left */}
								<div
									className={`
                    rounded-full z-10 flex items-center justify-center font-bold border-2 transition-colors w-10 h-10
                    ${
						step === 1
							? "bg-white border-emerald-500 text-emerald-600 shadow"
							: step === 2
							? "bg-emerald-50 border-emerald-400 text-emerald-500 shadow"
							: "bg-white border-gray-200 text-gray-400"
					}
                  `}
								>
									{step === 2 ? <Check size={20} /> : 1}
								</div>
								{/* Connector Line */}
								<div className="flex-1 h-1 relative">
									<div className="w-full h-1 rounded bg-gray-200 overflow-hidden">
										<div
											className={`h-1 rounded transition-all duration-300`}
											style={{
												background:
													step === 2
														? "#10b981"
														: "#a7f3d0",
												width:
													step === 2 ? "100%" : "6px",
												transition:
													"width 0.3s, background-color 0.3s",
											}}
										/>
									</div>
								</div>
								{/* Step 2 - Right */}
								<div
									className={`
                    rounded-full z-10 flex items-center justify-center font-bold border-2 transition-colors w-10 h-10
                    ${
						step === 2
							? "bg-white border-emerald-500 text-emerald-600 shadow"
							: "bg-white border-gray-200 text-gray-400"
					}
                  `}
								>
									2
								</div>
							</div>
						</div>
						{/* Text descriptions under each step */}
						<div className="flex w-full justify-between px-1 pr-3 max-w-xs text-xs font-medium select-none">
							<span
								className={`transition-colors ${
									step === 1
										? "text-emerald-600"
										: "text-gray-400"
								}`}
							>
								Select Member
							</span>
							<span
								className={`transition-colors ${
									step === 2
										? "text-emerald-600"
										: "text-gray-400"
								}`}
							>
								Contribution
							</span>
						</div>
					</div>
				</div>

				{/* Content Area */}
				<div className="flex-1 overflow-hidden">
					{/* Step 1: Member select */}
					{step === 1 && (
						<div className="h-full flex flex-col">
							<div className="flex-1 overflow-y-auto p-6">
								<MemberSelectStep
									members={nonAdminMembers}
									selectedMember={selectedMember}
									onSelect={handleSelectMember}
									onNext={() => {}} // Empty function since we handle in footer
									page={page}
									setPage={setPage}
									totalPages={totalPages}
									hideControls={true}
								/>
							</div>
						</div>
					)}

					{/* Step 2: Contribution Form */}
					{step === 2 && selectedMember && (
						<div className="h-full flex flex-col">
							<div className="flex-1 overflow-y-auto p-6">
								<ContributionFormStep
									selectedMember={selectedMember}
									formData={formData}
									onFormDataChange={handleFormDataChange}
									onBack={() => {}} // Empty function since we handle in footer
									onSubmit={handleSubmit}
									hideControls={true}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Footer with Controls */}
				<div className="border-t border-gray-100 p-4 bg-gray-50">
					{step === 1 && (
						<div className="flex flex-col space-y-4">
							{/* Next Button */}
							<button
								onClick={handleNext}
								disabled={!selectedMember}
								className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-full font-medium hover:from-emerald-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								Next
								<ArrowRight size={16} />
							</button>
						</div>
					)}

					{step === 2 && (
						<div className="flex space-x-4">
							<button
								type="button"
								onClick={handleBack}
								className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
							>
								<ArrowLeft size={16} />
								Back
							</button>
							<button
								type="button"
								onClick={handleSubmit}
								className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-full font-medium hover:from-emerald-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
							>
								Add Contribution
								<Plus size={16} />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddContributionStepper;
