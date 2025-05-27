import { AccountData } from '@mini-wallet/types';
import { delay, http, HttpResponse } from 'msw';

const mockAccountData: AccountData = {
  balance: 12250.75,
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
];
