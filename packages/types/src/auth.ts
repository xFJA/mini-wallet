import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

export function validateUser(data: unknown): User {
  return userSchema.parse(data);
}

export const loginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export function validateLoginCredentials(data: unknown): LoginCredentials {
  return loginCredentialsSchema.parse(data);
}

export const loginResponseSchema = z.object({
  token: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export function validateLoginResponse(data: unknown): LoginResponse {
  return loginResponseSchema.parse(data);
}
