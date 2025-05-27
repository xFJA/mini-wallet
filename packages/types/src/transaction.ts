import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  date: z.string().datetime(),
  status: z.enum(['completed', 'pending', 'failed']),
});

export type Transaction = z.infer<typeof transactionSchema>;

import { paginationSchema } from './common';

export const paginatedTransactionsSchema = paginationSchema.extend({
  transactions: z.array(transactionSchema),
});

export type PaginatedTransactions = z.infer<typeof paginatedTransactionsSchema>;

export const withdrawalFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'Must be a valid number',
    })
    .refine((val) => parseFloat(val) > 0, {
      message: 'Amount must be greater than 0',
    }),
});

export type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>;

export const withdrawalRequestSchema = z.object({
  amount: z.number().positive(),
});

export type WithdrawalRequest = z.infer<typeof withdrawalRequestSchema>;

export const withdrawalResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  transaction: transactionSchema,
  newBalance: z.number().nonnegative().optional(),
});

export type WithdrawalResponse = z.infer<typeof withdrawalResponseSchema>;
