'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/typography';
import { useAsyncToast } from '@/hooks';
import { resetPassword } from '@/service/account';
import Spinner from '@/components/general/Spinner';
import { toasterProps } from '@/lib/constants';

const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(16, 'Password must be less than 16 characters.'),
    confirmNewPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(16, 'Password must be less than 16 characters.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'Passwords must match.',
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { execute, loading } = useAsyncToast();

  const onSubmit = (data: ResetPasswordFormValues) => {
    execute(async () => await resetPassword(data), toasterProps.resetPassword);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-2'>
      {loading && <Spinner />}
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Reset Password</CardTitle>
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
              <Label htmlFor='newPassword'>New Password</Label>
              <Input
                autoComplete='off'
                id='newPassword'
                type='password'
                placeholder='Enter your new password'
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className='text-red-500 text-sm'>
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className='flex flex-col space-y-2'>
              <Label htmlFor='confirmNewPassword'>Confirm New Password</Label>
              <Input
                autoComplete='off'
                id='confirmNewPassword'
                type='password'
                placeholder='Re-enter your new password'
                {...register('confirmNewPassword')}
              />
              {errors.confirmNewPassword && (
                <p className='text-red-500 text-sm'>
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>
            <Button
              type='submit'
              variant='purple'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <div className='mt-8 flex justify-between items-center'>
            <Link href='/register' className='hover:underline text-green-800'>
              <Text tag='p'>Register Here</Text>
            </Link>
            <Link href='/login' className='hover:underline text-blue-700'>
              <Text tag='p'>Back to Login</Text>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordForm;
