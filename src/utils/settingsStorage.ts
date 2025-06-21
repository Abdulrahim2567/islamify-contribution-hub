
const SETTINGS_STORAGE_KEY = 'islamify_settings';

export interface AppSettings {
  associationName: string;
  registrationFee: number;
  maxLoanMultiplier: number;
}

export const defaultSettings: AppSettings = {
  associationName: 'Islamify',
  registrationFee: 5000,
  maxLoanMultiplier: 3,
};

export const getSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
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
