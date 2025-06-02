import { ExtensionOptions, defaultOptions } from '../types';

/**
 * Load saved options from Chrome's sync storage
 * @returns Promise that resolves to the current extension options
 */
export const loadOptions = async (): Promise<ExtensionOptions> => {
  const result = await chrome.storage.sync.get(defaultOptions);
  return result as ExtensionOptions;
};

/**
 * Save options to Chrome's sync storage
 * @param options The options to save
 */
export const saveOptions = async (options: ExtensionOptions): Promise<void> => {
  await chrome.storage.sync.set(options);
}; 