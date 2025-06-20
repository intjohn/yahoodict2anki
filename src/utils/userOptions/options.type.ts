import { z } from 'zod';

export const portSchema = z.number().int().min(1).max(65535);

export const tagsSchema = z.array(z.string());

export const ankiOptionsSchema = z.object({
  port: portSchema,
  defaultTags: tagsSchema,
});

export const userOptionsSchema = z.object({
  anki: ankiOptionsSchema,
});

export type AnkiOptions = z.infer<typeof ankiOptionsSchema>;
export type UserOptions = z.infer<typeof userOptionsSchema>;

export const DEFAULT_ANKI_PORT = 8765;

export const DEFAULT_TAGS = ['yahoo2anki'];

export const DEFAULT_OPTIONS: UserOptions = {
  anki: {
    port: DEFAULT_ANKI_PORT,
    defaultTags: DEFAULT_TAGS,
  },
};
