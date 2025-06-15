
import { Save } from "lucide-react";
import React from "react";

interface AdminSettingsFormProps {
  settings: {
    associationName: string;
    registrationFee: number;
    maxLoanMultiplier: number;
  };
  setSettings: React.Dispatch<React.SetStateAction<{
    associationName: string;
    registrationFee: number;
    maxLoanMultiplier: number;
  }>>;
}

const AdminSettingsForm: React.FC<AdminSettingsFormProps> = ({
  settings,
  setSettings,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Settings update logic placeholder
      }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Association Name
        </label>
        <input
          type="text"
          value={settings.associationName}
          onChange={(e) => setSettings(s => ({ ...s, associationName: e.target.value }))}
          className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Registration Fee (XAF)
        </label>
        <input
          type="number"
          value={settings.registrationFee}
          onChange={(e) => setSettings(s => ({ ...s, registrationFee: Number(e.target.value) }))}
          className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
          required
          min="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Maximum Loan Multiplier
        </label>
        <input
          type="number"
          value={settings.maxLoanMultiplier}
          onChange={(e) => setSettings(s => ({ ...s, maxLoanMultiplier: Number(e.target.value) }))}
          className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
          required
          min="1"
          max="10"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Members can borrow up to this many times their savings amount
        </p>
      </div>
      <button
        type="submit"
        className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105"
      >
        <Save size={20} />
        <span>Save Settings</span>
      </button>
    </form>
  );
};

export default AdminSettingsForm;

