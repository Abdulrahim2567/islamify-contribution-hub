import React, { useEffect, useState } from "react";
import {
	getSettings,
	saveSettings,
	initializeSettings,
	defaultSettings,
} from "@/utils/settingsStorage"; // adjust path to your actual file
import { IslamifySettingsContext } from "@/hooks/useIslamifySettings";
import { AppSettings } from "@/types/types";

export interface IslamifySettingsContextProps {
	settings: AppSettings;
	updateSettings: (newSettings: AppSettings) => void;
	resetSettings: () => void;
	refreshSettings: () => void;
}

export const IslamifySettingsProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const [settings, setSettings] = useState<AppSettings>(defaultSettings);

	useEffect(() => {
		const initial = initializeSettings();
		setSettings(initial);
	}, []);

	const updateSettings = (newSettings: AppSettings) => {
		saveSettings(newSettings);
		setSettings(newSettings);
	};

	const resetSettings = () => {
		saveSettings(defaultSettings);
		setSettings(defaultSettings);
	};

	const refreshSettings = () => {
		setSettings(getSettings());
	};

	const value: IslamifySettingsContextProps = {
		settings,
		updateSettings,
		resetSettings,
		refreshSettings,
	};

	return (
		<IslamifySettingsContext.Provider value={value}>
			{children}
		</IslamifySettingsContext.Provider>
	);
};
