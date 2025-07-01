import React, { useState, useEffect } from "react";
import { X, Check, ArrowRight, ArrowLeft, Plus } from "lucide-react";
import { Member } from "../../../types/types";
import { readMembersFromStorage } from "../../../utils/membersStorage";
import MemberSelectStep from "./AddContributionStepper/MemberSelectStep";
import ContributionFormStep from "./AddContributionStepper/ContributionFormStep";
import { getNowString } from "@/utils/calculations";
import { useIslamifySettings } from "@/hooks/useIslamifySettings";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

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


const AddContributionStepper: React.FC<AddContributionStepperProps> = ({
	open,
	onOpenChange,
	members,
	onSubmit,
	
}) => {
	const { settings } = useIslamifySettings();
	const [step, setStep] = useState<1 | 2>(1);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [page, setPage] = useState(0);
	const [formData, setFormData] = useState({ amount: "", description: "" });
	

	// Only non-admins selectable for contributions
	const nonAdminMembers = members.filter((m) => m.role !== "admin");
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
			date: getNowString(),
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
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center p-4 z-50   border">
			<div
				className="dark:bg-[#020817] rounded-xl border dark:border-gray-800 shadow-xl w-full max-w-md animate-fade-in flex flex-col relative overflow-hidden"
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
				<div className="flex flex-col items-center pt-8 pb-4 px-6 border-b border-gray-100 dark:border-gray-900">
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
							? "bg-background border-emerald-500 dark:border-emerald-400/80 text-emerald-600 dark:text-emerald-300/80 shadow"
							: step === 2
							? "bg-emerald-50 dark:bg-emerald-400/5 border-emerald-400 dark:border-emerald-400/80 text-emerald-500 dark:text-emerald-300/80 shadow"
							: "bg-background border-gray-200 dark:border-gray-900 text-gray-400 dark:text-gray-300/80"
					}
                  `}
								>
									{step === 2 ? <Check size={20} /> : 1}
								</div>
								{/* Connector Line */}
								<div className="flex-1 h-1 relative">
									<div className="w-full h-1 rounded bg-gray-200 dark:bg-gray-300/5 overflow-hidden">
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
							? "bg-background border-emerald-500 dark:border-emerald-400/80 text-emerald-600 dark:text-emerald-300/80 shadow"
							: "bg-background border-gray-200 dark:border-gray-900 text-gray-400 dark:text-gray-300/80"
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
										? "text-emerald-600 dark:text-emerald-300/80"
										: "text-gray-400 dark:text-gray-300/80"
								}`}
							>
								Select Member
							</span>
							<span
								className={`transition-colors ${
									step === 2
										? "text-emerald-600 dark:text-emerald-300/80"
										: "text-gray-400 dark:text-gray-300/80"
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
				<div className="border-t border-gray-100 p-4 bg-background dark:border-gray-900">
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
								className="flex-1 text-gray-700 dark:text-gray-300/80 py-3 px-4 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-blue-400/5 dark:border-blue-300/60 border border-gray-200 transition-colors flex items-center justify-center gap-2"
							>
								<ArrowLeft size={16} className="mt-[3px]" />
								Back
							</button>

							<button
								type="button"
								onClick={handleSubmit}
								disabled={
									!formData.amount ||
									isNaN(Number(formData.amount)) ||
									Number(formData.amount) <
										settings.minimumContributionAmount
								}
								className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-full font-medium hover:from-emerald-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Add Contribution
								<Plus size={16} className="mt-[3px]" />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddContributionStepper;
