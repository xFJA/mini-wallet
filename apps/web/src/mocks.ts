import { startWorker } from '@mini-wallet/mocks';

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  startWorker({ onUnhandledRequest: 'warn' }).catch((error: Error) => {
    console.error('[MSW] Failed to initialize:', error);
    throw error;
  });
}
