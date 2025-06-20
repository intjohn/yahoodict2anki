import { userOptionsSchema, portSchema, tagsSchema } from './options.type';
import type { UserOptions } from './options.type';

export function validateUserOptions(options: unknown): options is UserOptions {
  const result = userOptionsSchema.safeParse(options);
  return result.success;
}

export function validatePort(port: unknown): boolean {
  const result = portSchema.safeParse(port);
  return result.success;
}

export function validateTags(tags: unknown): boolean {
  const result = tagsSchema.safeParse(tags);
  return result.success;
}

export function getValidationErrors(options: unknown): string[] {
  const result = userOptionsSchema.safeParse(options);
  if (result.success) return [];

  return result.error.errors.map((error) => {
    const path = error.path.join('.') || 'root';
    return `${path}: ${error.message}`;
  });
}
