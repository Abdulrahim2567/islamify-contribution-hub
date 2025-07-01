import { AppSettings } from "@/types/types";

const SETTINGS_STORAGE_KEY = 'islamify_settings';

export const defaultSettings: AppSettings = {
  associationName: 'Islamify',
  registrationFee: 5000,
  maxLoanMultiplier: 3,
  minimumContributionAmount: 30000,
  loanEligibilityThreshold: 300000, // Default threshold for loan eligibility
};

export const getSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all required fields exist with defaults as fallback
      return {
        associationName: parsed.associationName || defaultSettings.associationName,
        registrationFee: typeof parsed.registrationFee === 'number' ? parsed.registrationFee : defaultSettings.registrationFee,
        maxLoanMultiplier: typeof parsed.maxLoanMultiplier === 'number' ? parsed.maxLoanMultiplier : defaultSettings.maxLoanMultiplier,
        minimumContributionAmount: typeof parsed.minimumContributionAmount === 'number' ? parsed.minimumContributionAmount : defaultSettings.minimumContributionAmount,
        loanEligibilityThreshold: typeof parsed.loanEligibilityThreshold === 'number' ? parsed.loanEligibilityThreshold : defaultSettings.loanEligibilityThreshold,
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    // Dispatch a custom event to notify other components of settings changes
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings }));

  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Initialize settings on module load to ensure they exist
export const initializeSettings = (): AppSettings => {
  const settings = getSettings();
  // Save to ensure localStorage has the complete settings object
  if (!localStorage.getItem(SETTINGS_STORAGE_KEY)) {
    saveSettings(settings);
  }
  return settings;
};