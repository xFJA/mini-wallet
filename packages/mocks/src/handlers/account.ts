import {
  DashboardData,
  Transaction,
  WithdrawalRequest,
  WithdrawalResponse,
} from '@mini-wallet/types';
import { delay, http, HttpResponse } from 'msw';

let mockAccountData: DashboardData = {
  balance: 12250.75,
  transactions: [
    {
      id: '1',
      amount: 1000,
      date: new Date().toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      amount: 250.25,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed',
    },
  ],
};

export const accountHandlers = [
  http.get('/api/wallet', async () => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Handling /api/wallet request...');

    await delay(300);

    return new HttpResponse(JSON.stringify(mockAccountData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  http.post('/api/withdraw', async ({ request }) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Handling /api/withdraw request...');

    await delay(500);

    try {
      const withdrawalRequest = (await request.json()) as WithdrawalRequest;
      const { amount } = withdrawalRequest;

      // Validate the withdrawal amount
      if (!amount || amount <= 0) {
        return new HttpResponse(
          JSON.stringify({
            success: false,
            message: 'Invalid withdrawal amount',
          } as WithdrawalResponse),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Check if there are sufficient funds
      if (amount > mockAccountData.balance) {
        return new HttpResponse(
          JSON.stringify({
            success: false,
            message: 'Insufficient funds',
          } as WithdrawalResponse),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Process the withdrawal
      const newBalance = mockAccountData.balance - amount;

      // Create a new transaction
      const transaction: Transaction = {
        id: Math.random().toString(36).substring(2, 10),
        amount,
        date: new Date().toISOString(),
        status: 'completed',
      };

      // Update the mock data
      mockAccountData = {
        ...mockAccountData,
        balance: newBalance,
        transactions: [transaction, ...(mockAccountData.transactions || [])],
      };

      return new HttpResponse(
        JSON.stringify({
          success: true,
          message: 'Withdrawal successful',
          transaction,
          newBalance,
        } as WithdrawalResponse),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: 'Invalid request format',
        } as WithdrawalResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }),
];
