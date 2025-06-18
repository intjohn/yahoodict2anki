import { describe, it, expect } from 'vitest';
import {
  validateUserOptions,
  validatePort,
  getValidationErrors,
} from '../src/utils/userOptions/optionsValidator';
import type { UserOptions } from '../src/utils/userOptions/options.type';

describe('optionsValidator', () => {
  describe('validateUserOptions', () => {
    it('should validate correct options', () => {
      const validOptions: UserOptions = {
        anki: {
          port: 8765,
        },
      };
      expect(validateUserOptions(validOptions)).toBe(true);
      expect(getValidationErrors(validOptions)).toEqual([]);
    });

    it('should reject invalid port numbers', () => {
      const invalidOptions = {
        anki: {
          port: 0, // below minimum
        },
      };
      expect(validateUserOptions(invalidOptions)).toBe(false);
      expect(getValidationErrors(invalidOptions)).toContain(
        'anki.port: Number must be greater than or equal to 1'
      );

      const invalidOptions2 = {
        anki: {
          port: 65536, // above maximum
        },
      };
      expect(validateUserOptions(invalidOptions2)).toBe(false);
      expect(getValidationErrors(invalidOptions2)).toContain(
        'anki.port: Number must be less than or equal to 65535'
      );
    });

    it('should reject non-integer port numbers', () => {
      const invalidOptions = {
        anki: {
          port: '8765', // string instead of number
        },
      };
      expect(validateUserOptions(invalidOptions)).toBe(false);
      expect(getValidationErrors(invalidOptions)).toContain(
        'anki.port: Expected number, received string'
      );
    });

    it('should reject missing required fields', () => {
      const invalidOptions = {
        anki: {}, // missing port
      };
      expect(validateUserOptions(invalidOptions)).toBe(false);
      expect(getValidationErrors(invalidOptions)).toContain('anki.port: Required');

      const invalidOptions2 = {}; // missing anki object
      expect(validateUserOptions(invalidOptions2)).toBe(false);
      expect(getValidationErrors(invalidOptions2)).toContain('anki: Required');
    });
  });

  describe('validatePort', () => {
    it('should validate correct port numbers', () => {
      expect(validatePort(1)).toBe(true);
      expect(validatePort(8765)).toBe(true);
      expect(validatePort(65535)).toBe(true);
    });

    it('should reject invalid port numbers', () => {
      expect(validatePort(0)).toBe(false);
      expect(validatePort(65536)).toBe(false);
      expect(validatePort(-1)).toBe(false);
    });

    it('should reject non-integer values', () => {
      expect(validatePort('8765')).toBe(false);
      expect(validatePort(8765.5)).toBe(false);
      expect(validatePort(null)).toBe(false);
      expect(validatePort(undefined)).toBe(false);
    });
  });
});
