import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdminActivityLog, AppSettings, Member } from "@/types/types";
import { useRecentActivities } from "@/hooks/useRecentActivities";

interface AdminSettingsFormProps {
	settings: AppSettings;
	updateSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
	member: Member;
}

const AdminSettingsForm: React.FC<AdminSettingsFormProps> = ({
	settings,
	updateSettings,
	member,
}) => {
	const { toast } = useToast();
	const [adminSettings, setAdminSettings] = useState<AppSettings>(settings);
	const {saveAdminActivity} =useRecentActivities()

	// Sync adminSettings if parent settings change
	useEffect(() => {
		setAdminSettings(settings);
	}, [settings]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const getNowString = () => {
			const d = new Date();
			return d.toLocaleString(undefined, {
				dateStyle: "medium",
				timeStyle: "short",
			});
		};

		try {
			updateSettings(adminSettings);

			const editSettings: AdminActivityLog = {
				id: Date.now() + Math.random(),
				timestamp: getNowString(),
				type: "edit_settings",
				text: `Updated settings for "${adminSettings.associationName}"`,
				color: "black",
				adminName: member.name,
				adminEmail: member.email,
				adminRole: member.role,
				memberId: member.id,
			};

			saveAdminActivity(editSettings);

			toast({
				title: "Settings Saved",
				description: "Your settings have been updated successfully.",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to save settings. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
					Association Name
				</label>
				<input
					type="text"
					value={adminSettings.associationName}
					onChange={(e) =>
						setAdminSettings((s) => ({
							...s,
							associationName: e.target.value,
						}))
					}
					className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
					Registration Fee (XAF)
				</label>
				<input
					type="number"
					value={adminSettings.registrationFee}
					onChange={(e) =>
						setAdminSettings((s) => ({
							...s,
							registrationFee: Number(e.target.value),
						}))
					}
					className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
					required
					min="0"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
					Maximum Loan Multiplier
				</label>
				<input
					type="number"
					value={adminSettings.maxLoanMultiplier}
					onChange={(e) =>
						setAdminSettings((s) => ({
							...s,
							maxLoanMultiplier: Number(e.target.value),
						}))
					}
					className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
					required
					min="1"
					max="10"
				/>
				<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
					Members can borrow up to this many times their savings
					amount
				</p>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
					Loan Eligibility Threshold
				</label>
				<input
					type="number"
					value={adminSettings.loanEligibilityThreshold}
					onChange={(e) =>
						setAdminSettings((s) => ({
							...s,
							loanEligibilityThreshold: Number(e.target.value),
						}))
					}
					className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
					required
					min="0"
				/>
			</div>

			<button
				type="submit"
				className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all w-full"
			>
				<Save size={20} />
				<span>Save Settings</span>
			</button>
		</form>
	);
};

export default AdminSettingsForm;
