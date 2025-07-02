import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWithOrdinal(date: Date): string {
	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "long" }); // "July"
	const year = date.getFullYear();

	// Determine ordinal suffix
	const ordinal =
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
			? "nd"
			: day % 10 === 3 && day !== 13
			? "rd"
			: "th";

	return `${day}${ordinal} ${month}, ${year}`;
}
