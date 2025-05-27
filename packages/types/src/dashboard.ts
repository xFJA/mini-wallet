import { z } from 'zod';
import { accountDataSchema } from './account';
import { transactionSchema } from './transaction';

/**
 * Schema for dashboard data that combines account and transaction information
 * @example
 * {
 *   balance: 1250.75,
 *   transactions: [
 *     {
 *       id: '1',
 *       amount: 500,
 *       date: '2025-05-27T09:00:00.000Z',
 *       status: 'completed'
 *     }
 *   ]
 * }
 */
export const dashboardDataSchema = accountDataSchema.extend({
  transactions: z.array(transactionSchema).default([]),
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;

/**
 * Validates dashboard data against the schema
 */
export function validateDashboardData(data: unknown): DashboardData {
  return dashboardDataSchema.parse(data);
}
