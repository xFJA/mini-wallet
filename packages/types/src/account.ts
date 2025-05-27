import { z } from 'zod';

/**
 * Schema for account data including balance and currency
 * @example
 * {
 *   balance: 1250.75
 * }
 */
export const accountDataSchema = z.object({
  balance: z.number().nonnegative(),
});

export type AccountData = z.infer<typeof accountDataSchema>;

export function validateAccountData(data: unknown): AccountData {
  return accountDataSchema.parse(data);
}
