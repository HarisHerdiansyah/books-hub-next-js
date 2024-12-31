'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/typography';
import Spinner from '../general/Spinner';
import { useToast } from '@/hooks';
import { toasterProps } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: LoginFormValues) => {
    const response = await signIn('credentials', { redirect: false, ...data });
    if (!response?.ok) {
      toast({
        variant: 'destructive',
        ...toasterProps.login.reject(
          response?.status === 401
            ? 'Unauthorized account'
            : 'Something is wrong. Try again later'
        ),
      });
      return;
    }

    const currentSession = await getSession();
    if (currentSession?.user.firstLogin) {
      router.replace('/input-profile');
    } else {
      router.replace(`/${currentSession?.user.username}/overview`);
    }
    toast({ variant: 'success', ...toasterProps.login.resolve() });
    return;
  };

  if (isSubmitting) {
    return <Spinner />;
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-2'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Books Hub Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex flex-col space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                autoComplete='off'
                id='email'
                type='email'
                placeholder='Enter your email'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email.message}</p>
              )}
            </div>
            <div className='flex flex-col space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                autoComplete='off'
                id='password'
                type='password'
                placeholder='Enter your password'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-red-500 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type='submit'
              variant='blue'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className='mt-8 flex justify-between items-center'>
            <Link
              href='/forgot-password'
              className='hover:underline text-red-700'
            >
              <Text tag='p'>Forgot Password?</Text>
            </Link>
            <Link href='/register' className='hover:underline text-green-800'>
              <Text tag='p'>Register Here</Text>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
