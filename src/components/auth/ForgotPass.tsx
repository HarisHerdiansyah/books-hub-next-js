'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/typography';
import { useAsyncToast } from '@/hooks';
import { sendEmailResetPassword } from '@/service/account';
import { toasterProps } from '@/lib/constants';
import Spinner from '@/components/general/Spinner';

const forgotPasswordSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { execute, loading } = useAsyncToast();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    execute(
      async () => await sendEmailResetPassword(data),
      toasterProps.emailReset
    );
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-2'>
      {loading && <Spinner />}
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription className='text-zinc-800'>
            Send reset link through the email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex flex-col space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                autoComplete='off'
                id='username'
                type='text'
                placeholder='Enter your username'
                {...register('username')}
              />
              {errors.username && (
                <p className='text-red-500 text-sm'>
                  {errors.username.message}
                </p>
              )}
            </div>
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
            <Button
              type='submit'
              variant='destructive'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
          <div className='mt-8 flex justify-between items-center'>
            <Link href='/register' className='hover:underline text-green-800'>
              <Text tag='p'>Register Here</Text>
            </Link>
            <Link href='/login' className='hover:underline text-blue-800'>
              <Text tag='p'>Login Here</Text>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordForm;
