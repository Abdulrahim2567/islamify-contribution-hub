import { createContext, useContext } from "react";
import { ContributionContextProps } from "@/islamify-context/ContributionContext";

export const ContributionContext = createContext<ContributionContextProps | undefined>(undefined);

export const useContributions = (): ContributionContextProps => {
	const context = useContext(ContributionContext);
	if (!context) {
		throw new Error("useContributions must be used within a ContributionProvider");
	}
	return context;
};
