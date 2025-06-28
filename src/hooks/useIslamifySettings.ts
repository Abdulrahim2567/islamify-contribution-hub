import { createContext, useContext } from "react";
import { IslamifySettingsContextProps } from "@/islamify-context/IslamifySettingsContext";

export const IslamifySettingsContext = createContext<IslamifySettingsContextProps | undefined>(undefined);

export const useIslamifySettings = (): IslamifySettingsContextProps => {
	const context = useContext(IslamifySettingsContext);
	if (!context) {
		throw new Error("useIslamifySettings must be used within an IslamifySettingsProvider");
	}
	return context;
};
