import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
	totalPages: number;
	itemsPerPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	currentPage: number;
	setItemsPerPage: (value: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
	totalPages,
	itemsPerPage,
	setItemsPerPage,
	setCurrentPage,
	currentPage,
}: PaginationControlsProps) => {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 py-3 px-4 border-t border-gray-100 dark:border-gray-900 bg-transparent flex-shrink-0">
			{" "}
			<div className="flex items-center gap-2 text-sm">
				<span className="text-gray-500">Items per page:</span>
				<Select
					value={String(itemsPerPage)}
					onValueChange={(value) => {
						setItemsPerPage(Number(value));
						setCurrentPage(1);
					}}
				>
					<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-400/5 text-blue-700 dark:text-blue-300/80 rounded-full capitalize font-semibold tracking-widest w-[150px] hover:bg-blue-100 flex justify-center dark:border-gray-900 dark:focus-visible:border-gray-900">
						<SelectValue />
					</SelectTrigger>
					<SelectContent side="top">
						{[5, 10, 20, 50].map((value) => (
							<SelectItem
								key={value}
								value={String(value)}
								className="hover:cursor-pointer text-gray-200 dark:text-gray-300/80"
							>
								{value} / page
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							aria-disabled={currentPage === 1}
							tabIndex={currentPage === 1 ? -1 : 0}
							onClick={(e) => {
								e.preventDefault();
								setCurrentPage((prev) => Math.max(1, prev - 1));
							}}
						/>
					</PaginationItem>
					{Array.from({ length: totalPages }).map((_, i) => (
						<PaginationItem key={i}>
							<PaginationLink
								href="#"
								isActive={currentPage === i + 1}
								onClick={(e) => {
									e.preventDefault();
									setCurrentPage(i + 1);
								}}
								className="hover:bg-blue-400/5 text-gray-800 dark:text-gray-300/80"
							>
								{i + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							href="#"
							aria-disabled={currentPage === totalPages}
							tabIndex={currentPage === totalPages ? -1 : 0}
							onClick={(e) => {
								e.preventDefault();
								setCurrentPage((prev) =>
									Math.min(totalPages, prev + 1)
								);
							}}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};
