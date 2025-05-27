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
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      amount: 250.25,
      date: new Date().toISOString(),
      status: 'completed',
    },
  ],
};

export const accountHandlers = [
  http.get('/api/transactions', async ({ request }) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Handling /api/transactions request...');

    await delay(800);

    // Get sort direction from query param (?sort=asc|desc)
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || 'desc';

    // Sort transactions by date
    const sortedTransactions = [...(mockAccountData.transactions || [])].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return new HttpResponse(
      JSON.stringify({
        transactions: sortedTransactions,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),

  http.get('/api/wallet', async () => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Handling /api/wallet request...');

    await delay(1000);

    return new HttpResponse(JSON.stringify(mockAccountData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  http.post('/api/withdraw', async ({ request }) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Handling /api/withdraw request...');

    await delay(2000);

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
        id: ((mockAccountData.transactions?.length || 0) + 1).toString(),
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
