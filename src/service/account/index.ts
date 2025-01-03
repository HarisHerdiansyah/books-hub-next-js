import api from '@/lib/api';

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
  return await api.post('/api/account/reset-password', payload);
}

export async function updatePassword(
  payload: Pick<Credentials, 'email'> & { newPassword: string }
) {
  return await api.post('/api/account/reset-password/update', payload);
}

export async function updateEmail(payload: Credentials & { newEmail: string }) {
  return await api.post('/api/account/update-email', payload);
}
