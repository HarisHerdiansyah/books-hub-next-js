import { redirect } from 'next/navigation';
import api from '@/lib/api';
import { axiosErrorLogger } from '@/lib/utils';

type Credentials = {
  username: string;
  email: string;
  password: string;
};

export async function register(payload: Credentials) {
  return await api.post('/api/account/register', payload);
}

export async function sendEmailResetPassword(
  payload: Omit<Credentials, 'password'>
) {
  await api.post('/api/account/reset-password/email', payload);
}

export async function resetPassword(
  payload: Pick<Credentials, 'email'> & { newPassword: string }
) {
  try {
    await api.post('/api/account/reset-password', payload);
    redirect('/login');
  } catch (e) {
    axiosErrorLogger(e);
  }
}
