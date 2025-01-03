import Link from 'next/link';
import { AxiosError } from 'axios';
import { ResetPassForm } from '@/components/auth';
import { Text } from '@/components/typography';
import api from '@/lib/api';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ token: string }>;
}) {
  const search = await searchParams;

  try {
    const response = await api.post('/api/account/reset-password/verify', {
      token: search?.token,
    });
    // eslint-disable-next-line no-console
    console.log(response);
    return <ResetPassForm />;
  } catch (e) {
    if (e instanceof AxiosError && 'response' in e) {
      return (
        <div className='h-screen w-screen p-6 text-center'>
          <Text tag='h2'>{e.response?.data.message}</Text>
          <Link href='/' className='text-lg text-blue-500 underline'>
            Go Back
          </Link>
        </div>
      );
    }
  }
}
