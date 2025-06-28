import React from "react";
import { DollarSign, ArrowLeft, Plus, User } from "lucide-react";
import type { Member } from "../../../../types/types";

interface ContributionFormStepProps {
	selectedMember: Member;
	formData: { amount: string; description: string };
	onFormDataChange: (formData: {
		amount: string;
		description: string;
	}) => void;
	onBack: () => void;
	onSubmit: (e: React.FormEvent) => void;
	hideControls?: boolean;
}

const ContributionFormStep: React.FC<ContributionFormStepProps> = ({
	selectedMember,
	formData,
	onFormDataChange,
	onBack,
	onSubmit,
	hideControls = false,
}) => {
	return (
		<div
			className={`
        transition-all duration-300 ease-in-out w-full px-6 pb-6
        opacity-100 translate-x-0 relative z-10
      `}
			style={{ maxHeight: 310 }}
		>
			<div className="mb-6 flex items-center justify-center pt-2">
				<h2 className="text-xl font-bold text-gray-900 text-center w-full">
					Add Contribution
				</h2>
			</div>
			<div className="flex flex-col items-center mb-2">
				<span className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-1">
					<User className="text-emerald-500" size={25} />
				</span>
				<span className="font-bold text-gray-900">
					{selectedMember.name}
				</span>
			</div>
			<form
				onSubmit={onSubmit}
				className="space-y-6"
				style={{ maxWidth: 400, margin: "0 auto" }}
			>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Amount (XAF)
					</label>
					<div className="relative">
						<DollarSign
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon"
							size={20}
						/>
						<input
							type="number"
							value={formData.amount}
							onChange={(e) =>
								onFormDataChange({
									...formData,
									amount: e.target.value,
								})
							}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							placeholder="Enter amount"
							required
							min="1"
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Description (optional)
					</label>
					<textarea
						value={formData.description}
						onChange={(e) =>
							onFormDataChange({
								...formData,
								description: e.target.value,
							})
						}
						className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						placeholder="Add a note..."
						rows={3}
					/>
				</div>
				{!hideControls && (
					<div className="flex space-x-4">
						<button
							type="button"
							onClick={onBack}
							className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
						>
							<ArrowLeft size={20} />
							Back
						</button>
						<button
							type="submit"
							className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-full font-medium hover:from-emerald-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
						>
							Add Contribution
							<Plus size={20} />
						</button>
					</div>
				)}
			</form>
		</div>
	);
};

export default ContributionFormStep;
