import { RegistrationFees } from "@/types/types";
const REGISTRATION_FEES_KEY = 'islamify_registrationFees';

function readRegistrationFees(): RegistrationFees[] {
    try {
        const stored = localStorage.getItem(REGISTRATION_FEES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function writeRegistrationFees(fees: RegistrationFees[]) {
    localStorage.setItem(REGISTRATION_FEES_KEY, JSON.stringify(fees));
}

//getMemberRegistrationFee
function getMemberRegistrationFee(memberId: number): RegistrationFees | undefined {
    const fees = readRegistrationFees();
    return fees.find(fee => fee.memberId === memberId);
}

//getTotalRegistrationFees
function getTotalRegistrationFees(): number {
    const fees = readRegistrationFees();
    return fees.reduce((total, fee) => total + fee.amount, 0);
}


export { readRegistrationFees, writeRegistrationFees, getMemberRegistrationFee, getTotalRegistrationFees };