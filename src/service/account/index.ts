import api from '@/lib/api';
import { axiosErrorLogger } from '@/lib/utils';

export type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  try {
    const response = await api.post('/api/account/login', payload);
    return response;
  } catch (e) {
    axiosErrorLogger(e);
  }
}

export async function register(payload: RegisterPayload) {
  try {
    await api.post('/api/account/register', payload);
  } catch (e) {
    axiosErrorLogger(e);
  }
}
