import React, { useState } from "react";
import { DollarSign, X, ArrowRight, ArrowLeft, User, Plus, Check } from "lucide-react";
import { Member } from "./types";

interface AddContributionStepperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  onSubmit: (data: {
    memberId: number;
    amount: number;
    type: "contribution";
    date: string;
    description?: string;
  }) => void;
}

const PAGE_SIZE = 6;

const AddContributionStepper: React.FC<AddContributionStepperProps> = ({
  open,
  onOpenChange,
  members,
  onSubmit,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({ amount: "", description: "" });

  // Only non-admins selectable.
  const nonAdminMembers = members.filter((m) => m.role !== "admin");
  const totalPages = Math.ceil(nonAdminMembers.length / PAGE_SIZE);

  const pageMembers = nonAdminMembers.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

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

        {/* Step 1: Select Member */}
        {step === 1 && (
          <div
            className={`
              transition-all duration-300 ease-in-out w-full px-6 pb-6
              opacity-100 translate-x-0 relative z-10
            `}
            style={{ minHeight: 384 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Select Member</h2>
            {/* Minimal cards, 2 columns if space */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {pageMembers.map((member) => (
                <button
                  key={member.id}
                  className={`flex flex-col items-center gap-2 border rounded-xl bg-white shadow hover:bg-emerald-50 transition-all group w-full py-3 px-2 ${
                    selectedMember?.id === member.id
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleSelectMember(member)}
                  type="button"
                  tabIndex={0}
                >
                  <span className="bg-emerald-100 rounded-full w-11 h-11 flex items-center justify-center transition-all">
                    <User className="text-emerald-500" size={24} />
                  </span>
                  <span className="font-medium text-gray-900 truncate text-base">
                    {member.name}
                  </span>
                </button>
              ))}
            </div>
            {/* Clean Pagination */}
            <div className="flex justify-center gap-1 mb-3">
              <button
                className="rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 px-2 py-1 disabled:opacity-40"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                type="button"
                aria-label="Previous page"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="px-3 py-1 text-gray-500 text-sm select-none">{`Page ${page + 1} of ${totalPages === 0 ? 1 : totalPages}`}</span>
              <button
                className="rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 px-2 py-1 disabled:opacity-40"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                type="button"
                aria-label="Next page"
              >
                <ArrowRight size={18} />
              </button>
            </div>
            {/* Next step */}
            <div className="flex justify-end mt-4">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium shadow hover:from-emerald-600 hover:to-blue-600 transition-all disabled:opacity-60"
                disabled={!selectedMember}
                onClick={handleNext}
                type="button"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contribution Form */}
        {step === 2 && (
          <div
            className={`
              transition-all duration-300 ease-in-out w-full px-6 pb-6
              opacity-100 translate-x-0 relative z-10
            `}
            style={{ minHeight: 430 }}
          >
            {/* Centered Add Contribution Heading, no Close Button */}
            <div className="mb-6 flex items-center justify-center pt-2">
              <h2 className="text-xl font-bold text-gray-900 text-center w-full">Add Contribution</h2>
            </div>
            {selectedMember && (
              <div className="flex flex-col items-center mb-2">
                <span className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-1">
                  <User className="text-emerald-500" size={25} />
                </span>
                <span className="font-bold text-gray-900">{selectedMember.name}</span>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              style={{ maxWidth: 400, margin: "0 auto" }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (XAF)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon" size={20} />
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter amount"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Add a note..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  Add Contribution
                  <Plus size={20} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddContributionStepper;
