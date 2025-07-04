import React from "react";
import { Input } from "../ui/input";
import { Check, Search } from "lucide-react";

interface SearchProps {
	searchTerm: string;
    searchStatus: string;
    setSearchTerm: (term: string) => void
}
const SearchComponent: React.FC<SearchProps> = ({searchTerm, setSearchTerm, searchStatus}) => {
	return (
		<div className="relative flex-1 max-w-md">
			<Search
				size={16}
				className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
			/>
			{/* Custom input */}
			<Input
				className="pl-9 pr-8 h-9 py-[22px] rounded-md text-sm border-gray-300 dark:border-gray-900 focus-visible:ring-emerald-300"
				placeholder="Search by name or email"
				value={searchTerm}
				onChange={(e) => {
					setSearchTerm(e.target.value);
				}}
			/>
			{/* Right icon: spinner or tick */}
			<div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 z-10">
				{searchStatus === "typing" ? (
					<svg
						className="animate-spin h-4 w-4 text-blue-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
						></path>
					</svg>
				) : searchStatus === "done" ? (
					<Check size={16} className="text-emerald-600" />
				) : null}
			</div>
		</div>
	);
};

export default SearchComponent;
