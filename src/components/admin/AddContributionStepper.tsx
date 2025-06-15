
import React, { useState } from "react";
import { DollarSign, X, ArrowRight, ArrowLeft, User } from "lucide-react";
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

  // Filter out admins
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

  // Animation classes for steps
  const animationClass =
    "transition-all duration-300 ease-in-out will-change-transform";

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-0 relative overflow-hidden animate-fade-in">
        <button
          onClick={() => {
            onOpenChange(false);
            setTimeout(() => {
              setStep(1);
              setSelectedMember(null);
              setFormData({ amount: "", description: "" });
              setPage(0);
            }, 300);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10"
          type="button"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        {/* Step indicators */}
        <div className="flex justify-center items-center gap-2 pt-8 mb-6">
          <div
            className={
              "w-4 h-4 rounded-full transition-all duration-300 " +
              (step === 1
                ? "bg-emerald-500 scale-110"
                : "bg-gray-300 opacity-70")
            }
          ></div>
          <div
            className={
              "w-4 h-4 rounded-full transition-all duration-300 " +
              (step === 2
                ? "bg-emerald-500 scale-110"
                : "bg-gray-300 opacity-70")
            }
          ></div>
        </div>
        {/* Step 1: Select member */}
        <div
          className={`${animationClass} ${
            step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full absolute"
          } w-full px-6 pb-6`}
          style={{ minHeight: 350 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Select Member</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pageMembers.map((member) => (
              <button
                key={member.id}
                className={`flex items-center gap-3 border rounded-lg px-3 py-3 bg-white shadow hover:bg-emerald-50 transition-colors group w-full ${selectedMember?.id === member.id ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-gray-200'}`}
                onClick={() => handleSelectMember(member)}
                type="button"
                tabIndex={0}
              >
                <span className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <User className="text-emerald-500" size={22}/>
                </span>
                <span className="font-semibold text-gray-900 truncate text-base">{member.name}</span>
              </button>
            ))}
          </div>
          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              className="flex items-center gap-1 text-gray-500 disabled:opacity-50"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              type="button"
            >
              <ArrowLeft size={18} />
              Prev
            </button>
            <div className="text-sm text-gray-400">{`Page ${page + 1} of ${totalPages === 0 ? 1 : totalPages}`}</div>
            <button
              className="flex items-center gap-1 text-gray-500 disabled:opacity-50"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              type="button"
            >
              Next
              <ArrowRight size={18} />
            </button>
          </div>
          {/* Next step */}
          <div className="flex justify-end mt-6">
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
        {/* Step 2: Contribution form */}
        <div
          className={`${animationClass} ${
            step === 2 ? "opacity-100 translate-x-0 absolute top-0 left-0 w-full h-full bg-white px-6 pb-6" : "opacity-0 translate-x-full absolute"
          }`}
          style={{ minHeight: 350 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
            Add Contribution
          </h2>
          {selectedMember && (
            <div className="flex flex-col items-center mb-4">
              <span className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-1">
                <User className="text-emerald-500" size={25}/>
              </span>
              <span className="font-bold text-gray-900">{selectedMember.name}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (XAF)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                <ArrowLeft size={18}/>
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all"
              >
                Add Contribution
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContributionStepper;
