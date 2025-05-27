/* eslint-disable no-console */
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export const startWorker = async (options?: {
  onUnhandledRequest?: 'bypass' | 'warn' | 'error';
}) => {
  try {
    await worker.start({
      onUnhandledRequest: options?.onUnhandledRequest || 'warn',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });

    console.log('[MSW] Mock Service Worker started');
    return worker;
  } catch (error) {
    console.error('[MSW] Failed to start worker:', error);
    throw error;
  }
};
