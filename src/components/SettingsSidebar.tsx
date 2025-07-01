// components/SettingsSidebar.tsx
import React, { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lightbulb, Monitor, Moon, Settings2Icon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AdminSettingsForm from "./admin/settings/AdminSettingsForm";
import { AppSettings, Member } from "@/types/types";

interface SettingsSidebarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
    settings: AppSettings,
    user: Member,
    updateSettings: (newSetings: AppSettings) => void
}

export function SettingsSidebar({ open, onOpenChange , settings, user, updateSettings}: SettingsSidebarProps) {
	const { setTheme, theme } = useTheme();

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-[400px] p-0">
				<div className="flex h-full flex-col">
					<div className="p-4 border-b border-border flex items-center gap-2 text-lg font-semibold">
						<Settings2Icon className="w-5 h-5" />
						Settings
					</div>

					<Tabs defaultValue="theme" className="flex-1 flex flex-col">
						{user && user.role === "admin" && (
							<TabsList
								className={cn(
									"grid grid-cols-2 w-full mt-2",
									"bg-background"
								)}
							>
								<TabsTrigger
									value="theme"
									className={cn(
										"rounded-md text-center",
										"data-[state=active]:bg-muted data-[state=active]:text-foreground",
										"transition-colors"
									)}
								>
									Theme
								</TabsTrigger>
								<TabsTrigger
									value="app"
									className={cn(
										"rounded-md text-center",
										"data-[state=active]:bg-muted data-[state=active]:text-foreground",
										"transition-colors"
									)}
								>
									App Settings
								</TabsTrigger>
							</TabsList>
						)}

						<TabsContent
							value="app"
							className="p-4 text-sm text-muted-foreground"
						>
							<p className="text-gray-600 ml-1 opacity-75 mb-2">
								Review or Edit Association Configurations
							</p>
							<AdminSettingsForm
								settings={settings}
								updateSettings={updateSettings}
								member={user}
							/>
						</TabsContent>

						<TabsContent value="theme" className="p-4">
							<div className="flex gap-2">
								{["light", "system", "dark"].map((mode) => (
									<ThemeButton
										key={mode}
										mode={
											mode as "light" | "system" | "dark"
										}
										active={theme === mode}
										onClick={() =>
											setTheme(mode as typeof theme)
										}
									/>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</SheetContent>
		</Sheet>
	);
}

interface ThemeButtonProps {
	mode: "light" | "system" | "dark";
	active?: boolean;
	onClick: () => void;
}

function ThemeButton({ mode, active, onClick }: ThemeButtonProps) {
	const icons = {
		light: <Lightbulb className="w-4 h-4" />,
		system: <Monitor className="w-4 h-4" />,
		dark: <Moon className="w-4 h-4" />,
	};

	const labels = {
		light: "Light",
		system: "System",
		dark: "Dark",
	};

	return (
		<Button
			onClick={onClick}
			variant="outline" // keep consistent style
			className={cn(
				"flex-1 flex flex-col gap-1 items-center py-6 transition-colors border",
				{
					"bg-gradient-to-br from-emerald-500 to-blue-500 text-white border-transparent":
						active,
					"hover:bg-muted": !active,
				}
			)}
		>
			{icons[mode]}
			<span className="text-xs">{labels[mode]}</span>
		</Button>
	);
}

