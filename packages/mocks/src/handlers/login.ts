import { LoginCredentials, LoginResponse } from '@mini-wallet/types';
import { delay, http, HttpResponse } from 'msw';

const mockUsers = [
  {
    email: 'user@example.com',
    password: 'password',
  },
];

export const loginHandlers = [
  http.post('/api/login', async ({ request }) => {
    await delay(1000);

    const credentials = (await request.json()) as LoginCredentials;
    const user = mockUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      return HttpResponse.json<LoginResponse>(
        {
          token: 'mock-jwt-token',
        },
        { status: 200 }
      );
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),
];
