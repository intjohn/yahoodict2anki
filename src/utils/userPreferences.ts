import {
  DEFAULT_PREFERENCES,
  userPreferencesSchema,
  type UserPreferences,
} from '../types/preferences';

export const loadUserPreferences = async (): Promise<UserPreferences> => {
  const result = await chrome.storage.sync.get('userPreferences');
  if (!result.userPreferences || !userPreferencesSchema.safeParse(result.userPreferences).success) {
    if (result.userPreferences) {
      console.error(
        'Invalid user preferences, errors:',
        userPreferencesSchema.safeParse(result.userPreferences).error
      );
    }
    await saveUserPreferences(DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  }
  return result.userPreferences as UserPreferences;
};

export const saveUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  await chrome.storage.sync.set({
    userPreferences: preferences,
  });
};
