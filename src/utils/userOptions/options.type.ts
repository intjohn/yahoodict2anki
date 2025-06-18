import { z } from 'zod';

export const portSchema = z.number().int().min(1).max(65535);

export const ankiOptionsSchema = z.object({
  port: portSchema,
});

export const userOptionsSchema = z.object({
  anki: ankiOptionsSchema,
});

export type AnkiOptions = z.infer<typeof ankiOptionsSchema>;
export type UserOptions = z.infer<typeof userOptionsSchema>;

export const DEFAULT_ANKI_PORT = 8765;

export const DEFAULT_OPTIONS: UserOptions = {
  anki: {
    port: DEFAULT_ANKI_PORT,
  },
};
