export const AnimatedClockIcon = () => (
	<svg
		className="w-5 h-5 text-yellow-600 dark:text-yellow-300"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
		<line
			x1="12"
			y1="12"
			x2="12"
			y2="7"
			className="origin-center animate-spin-slow"
		/>
		<line
			x1="12"
			y1="12"
			x2="15"
			y2="12"
			className="origin-center animate-spin-slower"
		/>
	</svg>
);
