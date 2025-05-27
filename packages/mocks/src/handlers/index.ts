import { accountHandlers } from './account';
import { authHandlers } from './auth';

export const handlers = [...accountHandlers, ...authHandlers];
