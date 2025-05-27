import { ApiClient, ApiClientConfig } from './client';

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

export * from './client';
export * from './utils/auth';
export * from './utils/storage';

export default createApiClient;
