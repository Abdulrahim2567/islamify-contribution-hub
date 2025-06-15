
import React, { useState } from 'react';
import { CreditCard, X } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface LoanApplicationProps {
  memberId: string;
  maxAmount: number;
  onSubmit: (data: {
    memberId: string;
    amount: number;
    maxAmount: number;
    applicationDate: string;
    status: 'pending';
    reason: string;
  }) => void;
  onCancel: () => void;
}

const LoanApplication: React.FC<LoanApplicationProps> = ({
  memberId,
  maxAmount,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);

    if (amount > maxAmount) {
      alert(`Loan amount cannot exceed ${formatCurrency(maxAmount)}`);
      return;
    }

    onSubmit({
      memberId,
      amount,
      maxAmount,
      applicationDate: new Date().toISOString(),
      status: 'pending',
      reason: formData.reason,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in relative">
        <button
          onClick={onCancel}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Apply For Loan
          </h2>
          <div className="text-gray-500 text-sm">
            Submit your loan request to the association
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-800">
            <strong>Maximum loan amount:</strong> {formatCurrency(maxAmount)}
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Based on 3× your current savings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (XAF)
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon" size={20} />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter loan amount"
                required
                min="1"
                max={maxAmount}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of Loan
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Describe why you need this loan..."
              rows={4}
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplication;
