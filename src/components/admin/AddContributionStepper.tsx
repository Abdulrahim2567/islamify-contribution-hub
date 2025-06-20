import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Member } from "./types";
import { readMembers } from "../../utils/membersStorage";
import MemberSelectStep from "./AddContributionStepper/MemberSelectStep";
import ContributionFormStep from "./AddContributionStepper/ContributionFormStep";

interface AddContributionStepperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[]; // unused now
  onSubmit: (data: {
    memberId: number;
    amount: number;
    type: "contribution";
    date: string;
    description?: string;
  }) => void;
}

const PAGE_SIZE = 6;

const DEMO_ADMIN_EMAIL = "admin@islamify.org";

const AddContributionStepper: React.FC<AddContributionStepperProps> = ({
  open,
  onOpenChange,
  members: _propMembers, // ignore propMembers
  onSubmit,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({ amount: "", description: "" });
  const [localMembers, setLocalMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (open) {
      // Only get members from localStorage. If empty, insert only demo admin.
      const freshMembers = readMembers();
      // Only demo admin user if no other persisted members
      if (!freshMembers || freshMembers.length === 0) {
        setLocalMembers([
          {
            id: 1,
            name: "Admin User",
            email: DEMO_ADMIN_EMAIL,
            phone: "",
            registrationFee: 0,
            totalContributions: 0,
            isActive: true,
            loanEligible: false,
            joinDate: (new Date()).toISOString().split("T")[0],
            role: "admin",
          },
        ]);
      } else {
        setLocalMembers(freshMembers);
      }
    }
  }, [open]);

  // Only non-admins selectable for contributions
  const nonAdminMembers = localMembers.filter((m) => m.role !== "admin");
  const totalPages = Math.ceil(nonAdminMembers.length / PAGE_SIZE);

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
  };

  const handleNext = () => {
    if (selectedMember) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSelectedMember(null);
      setFormData({ amount: "", description: "" });
      setPage(0);
    }, 250);
  };

  const handleFormDataChange = (data: { amount: string; description: string }) => {
    setFormData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    onSubmit({
      memberId: selectedMember.id,
      amount: parseFloat(formData.amount),
      type: "contribution",
      date: new Date().toISOString(),
      description: formData.description || undefined,
    });
    setFormData({ amount: "", description: "" });
    setSelectedMember(null);
    setStep(1);
    setPage(0);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-0 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10"
          type="button"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        {/* Stepper Progress Indicator - Always Visible */}
        <div className="flex flex-col items-center pt-8 mb-6">
          <div className="w-full flex flex-col items-center">
            {/* Stepper Indicator */}
            <div className="relative w-full flex items-center justify-between mb-3" style={{ maxWidth: 270, minWidth: 250 }}>
              <div className="relative flex items-center w-full">
                {/* Step 1 - Left */}
                <div
                  className={`
                    rounded-full z-10 flex items-center justify-center font-bold border-2 transition-colors w-10 h-10
                    ${step === 1 ? "bg-white border-emerald-500 text-emerald-600 shadow" : (step === 2 ? "bg-emerald-50 border-emerald-400 text-emerald-500 shadow" : "bg-white border-gray-200 text-gray-400")}
                  `}
                >
                  {step === 2 ? <Check size={20} /> : 1}
                </div>
                {/* Connector Line */}
                <div className="flex-1 h-1 mx-2 relative">
                  <div className="w-full h-1 rounded bg-gray-200 overflow-hidden">
                    <div
                      className={`h-1 rounded transition-all duration-300`}
                      style={{
                        background: step === 2 ? "#10b981" : "#a7f3d0",
                        width: step === 2 ? "100%" : "6px",
                        transition: "width 0.3s, background-color 0.3s",
                      }}
                    />
                  </div>
                </div>
                {/* Step 2 - Right */}
                <div
                  className={`
                    rounded-full z-10 flex items-center justify-center font-bold border-2 transition-colors w-10 h-10
                    ${step === 2 ? "bg-white border-emerald-500 text-emerald-600 shadow" : "bg-white border-gray-200 text-gray-400"}
                  `}
                >
                  2
                </div>
              </div>
            </div>
            {/* Text descriptions under each step */}
            <div className="flex w-full justify-between px-1 max-w-xs text-xs font-medium select-none">
              <span className={`transition-colors ${step === 1 ? "text-emerald-600" : "text-gray-400"}`}>
                Select Member
              </span>
              <span className={`transition-colors ${step === 2 ? "text-emerald-600" : "text-gray-400"}`}>
                Contribution
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Member select */}
        {step === 1 && (
          <MemberSelectStep
            members={nonAdminMembers}
            selectedMember={selectedMember}
            onSelect={handleSelectMember}
            onNext={handleNext}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}

        {/* Step 2: Contribution Form */}
        {step === 2 && selectedMember && (
          <ContributionFormStep
            selectedMember={selectedMember}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AddContributionStepper;
