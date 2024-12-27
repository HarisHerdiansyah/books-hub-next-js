'use client';

import Link from 'next/link';
import { Text } from '../typography';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const forgotPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
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

  const onSubmit = (data: ForgotPasswordFormValues) => {
    /* eslint-disable no-console */
    console.log('Reset Password Data:', data);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-2'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex flex-col space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
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
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Re-enter your new password'
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-red-500 text-sm'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type='submit'
              variant='red'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Reset Password'}
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
