import { z } from 'zod';

export const fieldMappingsSchema = z.record(z.string(), z.array(z.string()));

export const userPreferencesSchema = z
  .object({
    selectedDeck: z.string(),
    selectedModel: z.string(),
    fieldMappings: fieldMappingsSchema,
    allowDuplicate: z.boolean(),
  })
  .strict();

export type FieldMappings = z.infer<typeof fieldMappingsSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const DEFAULT_FIELD_MAPPINGS: FieldMappings = {};

export const DEFAULT_PREFERENCES: UserPreferences = {
  selectedDeck: '',
  selectedModel: '',
  fieldMappings: DEFAULT_FIELD_MAPPINGS,
  allowDuplicate: false,
};
