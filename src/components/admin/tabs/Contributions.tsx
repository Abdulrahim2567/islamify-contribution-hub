import React, { useMemo, useState } from "react";
import AdminContributionsTable from "../contribution/AdminContributionsTable";
import ContributionsTable from "../../common/ContributionsTable";
import { Member } from "@/types/types";
import { useContributions } from "@/hooks/useContributions";
import { Coins, Shield, User } from "lucide-react";

interface ContributionsProps {
	thisMember: Member;
}

const Contributions: React.FC<ContributionsProps> = ({ thisMember }) => {
	const { contributions } = useContributions();
	const [tab, setTab] = useState<"all" | "mine">("mine");
	const [page, setPage] = useState(1);
	const adminContributions = useMemo(() => {
		return contributions
			.filter((c) => c.memberId === thisMember.id) // 👈 Only show contributions where admin is the contributor
			.map((c) => ({
				...c,
				memberName: thisMember.name, // 👈 All contributions belong to the admin, so name is the same
			}));
	}, [contributions, thisMember]);

	return (
		<div className="space-y-6">
			{thisMember.role === "admin" ? (
				tab === "mine" ? (
					<div className="mb-8">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
									<Coins className="w-6 h-6 text-white" />
								</div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
									Your Contributions
								</h1>
							</div>
							<p className="text-gray-600 ml-1 dark:text-gray-300/80 text-sm mt-5">
								All your personal contributions will appear
								here.
							</p>
						</div>
					</div>
				) : (
					<div className="mb-8">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
									<Coins className="w-6 h-6 text-white" />
								</div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
									Manage Contributions
								</h1>
							</div>
							<p className="text-gray-600 ml-1 dark:text-gray-300/80 text-sm mt-5">
								Edit or Delete individual member contributions
							</p>
						</div>
					</div>
				)
			) : (
				<div className="mb-8">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
								<Coins className="w-6 h-6 text-white" />
							</div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
								Your Contributions
							</h1>
						</div>
						<p className="text-gray-600 ml-1 dark:text-gray-400/80 text-sm mt-5">
							All your contributions added by the admin will
							appear here.
						</p>
					</div>
				</div>
			)}
			{thisMember.role === "admin" && (
				<div className="flex gap-2">
					<button
						className={`px-4 py-2 rounded text-sm flex justify-center items-center ${
							tab === "mine"
								? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white dark:bg-blue-400/5 text-gray-600 dark:text-blue-300/80"
								: "bg-background border border-gray-600 dark:border-gray-900 dark:text-gray-300/80 dark:hover:bg-blue-400/5"
						}`}
						onClick={() => setTab("mine")}
					>
						<User size={15} className="mr-2 mt-[1px]" />
						My Contributions
					</button>
					<button
						className={`px-4 py-2 rounded text-sm flex justify-center items-center ${
							tab === "all"
								? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white dark:bg-blue-400/5 text-gray-600 dark:text-blue-300/80"
								: "bg-background border border-gray-600 dark:border-gray-900 dark:text-gray-300/80 dark:hover:bg-blue-400/5"
						}`}
						onClick={() => setTab("all")}
					>
						<Shield size={15} className="mr-2 mt-[1px]" />
						Manage Contributions
					</button>
				</div>
			)}

			{tab === "all" ? (
				<AdminContributionsTable currentUser={thisMember} />
			) : (
				<ContributionsTable
					data={adminContributions}
					page={page}
					totalPages={Math.ceil(adminContributions.length / 10)}
					onEdit={() => {}}
					onDelete={() => {}}
					onPageChange={(p) => setPage(p)}
					readOnly={true}
				/>
			)}
		</div>
	);
};

export default Contributions;
