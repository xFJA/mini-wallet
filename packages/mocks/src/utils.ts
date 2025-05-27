import { HttpResponse } from 'msw';

export const checkAuthorization = (request: Request): HttpResponse<null> | null => {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized - Missing or invalid token',
    });
  }

  return null;
};
