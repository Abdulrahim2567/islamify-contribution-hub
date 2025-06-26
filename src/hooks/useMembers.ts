import { createContext, useContext } from "react";
import { MemberContextProps } from "../islamify-context/MemberContext";

export const MemberContext = createContext<MemberContextProps | undefined>(undefined);

export const useMembers = (): MemberContextProps => {
    const context = useContext(MemberContext);
    if (!context) {
        throw new Error("useMembers must be used within a MemberProvider");
    }
    return context;
};