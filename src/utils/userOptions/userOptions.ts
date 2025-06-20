import type { UserOptions } from './options.type';
import { validateUserOptions, getValidationErrors, validatePort } from './optionsValidator';
import { DEFAULT_OPTIONS } from './options.type';

const STORAGE_KEY = 'userOptions';

/**
 * Load saved options from Chrome's sync storage.
 * If fields are missing, default values are filled in.
 * @returns Promise that resolves to the current extension options
 */
export const loadUserOptions = async (): Promise<UserOptions> => {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const options = result[STORAGE_KEY] as unknown;

  if (!options || !validateUserOptions(options)) {
    if (options) {
      console.error('Invalid options, errors:', getValidationErrors(options));
    }
    await saveUserOptions(DEFAULT_OPTIONS);
    return DEFAULT_OPTIONS;
  }
  return options;
};

/**
 * Save options to Chrome's sync storage.
 * @param options The options to save
 */
export const saveUserOptions = async (options: UserOptions): Promise<void> => {
  await chrome.storage.sync.set({
    [STORAGE_KEY]: options,
  });
};

export const isPortValid = (port: number | string): boolean => {
  return validatePort(port);
};
