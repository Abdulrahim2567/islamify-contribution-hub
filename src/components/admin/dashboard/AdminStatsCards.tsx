import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line } from "recharts";
import { Users, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";

interface StatsCardProps {
	title: string;
	value: string;
	subtitle?: string;
	icon: React.ReactNode;
	chartData: { date: string; value: number }[];
	color: "blue" | "emerald" | "indigo" | "purple";
}

interface AdminStatsCardsProps {
	totalMembers: number;
	activeMembers: number;
	inactiveMembers: number;
	totalContributions: number;
	totalRegistrationFees: number;
}

function StatsCard({
	title,
	value,
	subtitle,
	icon,
	chartData,
	color,
}: StatsCardProps) {
	const textColorMap: Record<StatsCardProps["color"], string> = {
		blue: "text-blue-600 dark:text-blue-300/80",
		emerald: "text-emerald-600 dark:text-emerald-300/80",
		indigo: "text-indigo-600 dark:text-indigo-300/80",
		purple: "text-purple-600 dark:text-purple-300/80",
	};

	const bgColorMap: Record<StatsCardProps["color"], string> = {
		blue: "bg-blue-100 dark:bg-blue-400/5",
		emerald: "bg-emerald-100 dark:bg-emerald-300/5",
		indigo: "bg-indigo-100 dark:bg-indigo-300/5",
		purple: "bg-purple-100 dark:bg-purple-300/5",
	};

	const strokeColorMap: Record<StatsCardProps["color"], string> = {
		blue: "#3b82f6",
		emerald: "#10b981",
		indigo: "#6366f1",
		purple: "#8b5cf6",
	};

	const textColorClass = textColorMap[color];
	const bgColorClass = bgColorMap[color];
	const strokeColor = strokeColorMap[color];

	return (
		<Card className="hover:shadow-md transition-shadow mb-4 dark:border-gray-900">
			<CardHeader>
				<div className="flex justify-between items-center">
					<div>
						<CardTitle className="text-gray-500 text-lg leading-tight">
							{title}
						</CardTitle>

						<p
							className={`text-[16px] mt-3 font-bold ${textColorClass}`}
						>
							{value}
						</p>
						{subtitle && (
							<p className="text-gray-500 text-sm mt-0.5">
								{subtitle}
							</p>
						)}
					</div>
					<div className={`p-3 rounded-xl ${bgColorClass}`}>
						{icon}
					</div>
				</div>
			</CardHeader>
{/* 
			<CardContent>
				<ChartContainer
					config={{
						value: {
							label: title,
							color: strokeColor,
						},
					}}
				>
					<LineChart
						data={chartData}
						margin={{ top: 0, bottom: 0, left: -10, right: 0 }}
						width={200}
						height={50}
					>
						<Line
							type="monotone"
							dataKey="value"
							stroke={strokeColor}
							strokeWidth={2}
							dot={false}
						/>
						<ChartTooltipContent
							nameKey="value"
							labelFormatter={(x: string) => x}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent> */}
		</Card>
	);
}

export default function AdminStatsCards({
	totalMembers,
	activeMembers,
	inactiveMembers,
	totalContributions,
	totalRegistrationFees,
}: AdminStatsCardsProps) {
	const makeData = () =>
		Array.from({ length: 7 }, (_, i) => ({
			date: `D-${6 - i}`,
			value: Math.floor(Math.random() * 1000),
		}));

	const totalFunds = totalContributions + totalRegistrationFees;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<StatsCard
				title="Total Members"
				value={totalMembers.toLocaleString()}
				subtitle={`Active: ${activeMembers} • Inactive: ${inactiveMembers}`}
				icon={<Users className="w-6 h-6 text-blue-600" />}
				chartData={makeData()}
				color="blue"
			/>
			<StatsCard
				title="Contributions"
				value={`${formatCurrency(totalContributions)}`}
				icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
				chartData={makeData()}
				color="emerald"
			/>
			<StatsCard
				title="Registration Fees"
				value={`${formatCurrency(totalRegistrationFees)}`}
				icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
				chartData={makeData()}
				color="indigo"
			/>
			<StatsCard
				title="Total Funds"
				value={`${formatCurrency(totalFunds)}`}
				icon={<CreditCard className="w-6 h-6 text-purple-600" />}
				chartData={makeData()}
				color="purple"
			/>
		</div>
	);
}
