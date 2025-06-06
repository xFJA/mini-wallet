import {
  DashboardData,
  Transaction,
  WithdrawalRequest,
  WithdrawalResponse,
} from '@mini-wallet/types';
import { delay, http, HttpResponse } from 'msw';
import { checkAuthorization } from '../utils';

const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  for (let i = 1; i <= count; i++) {
    transactions.push({
      id: (count - i + 1).toString(), // Invert ID order so oldest transaction has ID 1
      amount: Math.round(Math.random() * 10000) / 100,
      date: new Date(Date.now() - i * 3600000).toISOString(), // Each transaction 1 hour apart
      status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'pending' : 'failed') : 'completed',
    });
  }
  return transactions;
};

let mockAccountData: DashboardData = {
  balance: 12250.75,
  transactions: generateMockTransactions(25), // Generate 25 mock transactions
};

export const accountHandlers = [
  http.get('/api/transactions', async ({ request }) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Handling /api/transactions request...');

    await delay(800);

    const authResponse = checkAuthorization(request);
    if (authResponse) {
      return authResponse;
    }

    // Get query parameters
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || 'desc';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '5', 10);

    // Sort transactions by date
    const sortedTransactions = [...(mockAccountData.transactions || [])].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      // If dates are different, sort by date according to sort direction
      if (dateA !== dateB) {
        return sort === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // If dates are the same, prioritize completed transactions
      if (a.status === 'completed' && b.status !== 'completed') return -1;
      if (a.status !== 'completed' && b.status === 'completed') return 1;

      // If both have same status and date, use ID for consistent ordering
      // For consistent ordering, lower IDs (newer transactions) should come first
      return parseInt(a.id) - parseInt(b.id);
    });

    // Calculate pagination
    const totalItems = sortedTransactions.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

    return new HttpResponse(
      JSON.stringify({
        transactions: paginatedTransactions,
        page,
        pageSize,
        totalPages,
        totalItems,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),

  http.get('/api/wallet', async ({ request }) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Handling /api/wallet request...');

    await delay(1000);

    const authResponse = checkAuthorization(request);
    if (authResponse) {
      return authResponse;
    }

    return new HttpResponse(JSON.stringify({ balance: mockAccountData.balance }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  http.post('/api/withdraw', async ({ request }) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Handling /api/withdraw request...');

    await delay(2000);

    const authResponse = checkAuthorization(request);
    if (authResponse) {
      return authResponse;
    }

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

      // Create a new transaction with ID 1 (newest)
      const transaction: Transaction = {
        id: '1',
        amount,
        date: new Date().toISOString(),
        status: 'completed',
      };

      // Increment all other transaction IDs to maintain ordering
      if (mockAccountData.transactions) {
        mockAccountData.transactions = mockAccountData.transactions.map((t) => ({
          ...t,
          id: (parseInt(t.id) + 1).toString(), // Increment existing IDs
        }));
      }

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
