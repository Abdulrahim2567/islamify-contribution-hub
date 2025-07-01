import React from "react";
import { DollarSign, User } from "lucide-react";
import type { Member } from "../../../../types/types";
import { Input } from "@/components/ui/input";
import { useIslamifySettings } from "@/hooks/useIslamifySettings";
import { formatCurrency } from "@/utils/calculations";

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
	const { settings } = useIslamifySettings();

	return (
		<div
			className={`
        transition-all duration-300 ease-in-out w-full px-6 pb-6
        opacity-100 translate-x-0 relative z-10
      `}
			style={{ maxHeight: 310 }}
		>
			<div className="mb-6 flex items-center justify-center pt-2">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-300/80 text-center w-full">
					Add Contribution
				</h2>
			</div>
			<div className="flex flex-col items-center mb-2">
				<span className="bg-emerald-100 dark:bg-emerald-400/5 rounded-full w-12 h-12 flex items-center justify-center mb-1">
					<User
						className="text-emerald-500 dark:text-emerald-300/80"
						size={25}
					/>
				</span>
				<span className="font-bold text-gray-900 dark:text-gray-300/80">
					{selectedMember.name}
				</span>
			</div>
			<div className="bg-emerald-50 border border-emerald-200 dark:border-emerald-200/50 dark:bg-emerald-400/5 border-dashed rounded-lg p-4 mb-6">
				<p className="text-xs text-emerald-600 dark:text-emerald-700 mt-1">
					The contribution amount must be{" "}
					<strong className=" font-bold">{formatCurrency(settings.minimumContributionAmount)}</strong> or Above
				</p>
			</div>
			<form
				onSubmit={onSubmit}
				className="space-y-6"
				style={{ maxWidth: 400, margin: "0 auto" }}
			>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300/80 mb-2">
						Amount (XAF)
					</label>
					<div className="relative">
						<DollarSign
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-emerald-300/80 input-icon"
							size={20}
						/>
						<Input
							type="number"
							value={formData.amount}
							onChange={(e) =>
								onFormDataChange({
									...formData,
									amount: e.target.value,
								})
							}
							className="w-full pl-10 pr-4 py-3"
							placeholder="Enter amount"
							required
							min="1"
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300/80 mb-2">
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
						className="w-full p-3 border bg-background dark:border-gray-900 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						placeholder="Add a note..."
						rows={3}
					/>
				</div>
			</form>
		</div>
	);
};

export default ContributionFormStep;
