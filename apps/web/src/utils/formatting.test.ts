import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate } from './formatting';

describe('formatting utilities', () => {
  describe('formatCurrency()', () => {
    it('formats currency with default options', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('respects custom fraction digits', () => {
      expect(
        formatCurrency(1234.5678, { minimumFractionDigits: 3, maximumFractionDigits: 4 })
      ).toBe('$1,234.5678');
    });

    it('supports different currencies', () => {
      expect(formatCurrency(1234.56, { currency: 'EUR' })).toBe('€1,234.56');
    });
  });

  describe('formatDate()', () => {
    it('formats date correctly', () => {
      const testDate = new Date('2025-05-27T12:34:56Z');
      const isoString = testDate.toISOString();

      const formatted = formatDate(isoString);

      expect(formatted).toContain('2025');
      expect(formatted).toMatch(/May|5/);
      expect(formatted).toContain('27');
      expect(formatted).toMatch(/12|PM/i);
    });
  });
});
