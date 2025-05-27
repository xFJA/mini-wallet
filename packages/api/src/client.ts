import {
  AccountData,
  LoginCredentials,
  PaginatedTransactions,
  SortDirection,
  Transaction,
  User,
  WithdrawalFormValues,
  WithdrawalResponse,
} from '@mini-wallet/types';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  getAuthHeaders,
  removeAuthToken,
  removeUserData,
  setAuthToken,
  setUserData,
} from './utils/auth';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
    });

    this.client.interceptors.request.use(async (config) => {
      const authHeaders = await getAuthHeaders();

      if (authHeaders['Authorization']) {
        config.headers.set('Authorization', authHeaders['Authorization']);
      }
      if (authHeaders['Content-Type']) {
        config.headers.set('Content-Type', authHeaders['Content-Type']);
      }

      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.auth.logout();
          await this.auth.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  auth = {
    login: async (credentials: LoginCredentials): Promise<User> => {
      try {
        const response: AxiosResponse<{ token: string; user: User }> = await this.client.post(
          '/auth/login',
          credentials
        );

        await setAuthToken(response.data.token);
        await setUserData(response.data.user);

        return response.data.user;
      } catch (error) {
        throw this.handleApiError(error, 'Login failed');
      }
    },

    logout: async (): Promise<void> => {
      try {
        await this.client.post('/auth/logout');
      } catch (error) {
        // Ignore errors during logout
        // eslint-disable-next-line no-console
        console.warn('Logout API call failed, clearing local data anyway');
      } finally {
        await removeAuthToken();
        await removeUserData();
      }
    },

    checkAuth: async (): Promise<User | null> => {
      try {
        const response: AxiosResponse<{ user: User }> = await this.client.get('/auth/me');

        await setUserData(response.data.user);

        return response.data.user;
      } catch (error) {
        await removeAuthToken();
        await removeUserData();
        return null;
      }
    },
  };

  wallet = {
    getBalance: async (): Promise<AccountData> => {
      try {
        const response: AxiosResponse<{ balance: number }> =
          await this.client.get('/wallet/balance');

        return { balance: response.data.balance };
      } catch (error) {
        throw this.handleApiError(error, 'Failed to fetch balance');
      }
    },

    withdraw: async (data: WithdrawalFormValues): Promise<WithdrawalResponse> => {
      try {
        const response: AxiosResponse<WithdrawalResponse> = await this.client.post(
          '/wallet/withdraw',
          { amount: parseFloat(data.amount) }
        );

        return response.data;
      } catch (error) {
        throw this.handleApiError(error, 'Withdrawal failed');
      }
    },
  };

  transactions = {
    getList: async (params?: {
      page?: number;
      pageSize?: number;
      sortDirection?: SortDirection;
    }): Promise<PaginatedTransactions> => {
      try {
        const response: AxiosResponse<PaginatedTransactions> = await this.client.get(
          '/transactions',
          {
            params,
          }
        );

        return response.data;
      } catch (error) {
        throw this.handleApiError(error, 'Failed to fetch transactions');
      }
    },

    getById: async (id: string): Promise<Transaction> => {
      try {
        const response: AxiosResponse<{ transaction: Transaction }> = await this.client.get(
          `/transactions/${id}`
        );

        return response.data.transaction;
      } catch (error) {
        throw this.handleApiError(error, 'Failed to fetch transaction');
      }
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleApiError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }
}
