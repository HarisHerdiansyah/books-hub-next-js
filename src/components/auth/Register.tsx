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
import { register as userRegister } from '@/service/account';
import Spinner from '../general/Spinner';
import { useToast } from '@/hooks';
import { toasterProps } from '@/lib/constants';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(10, 'Username must be at least 10 characters.')
      .max(20, 'Username must not exceed 20 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match.',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  const { toast } = useToast();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await userRegister(data);
      toast({ variant: 'success', ...toasterProps.register.resolve });
    } catch (e) {
      toast({ variant: 'destructive', ...toasterProps.register.reject });
      throw e;
    }
  };

  if (isSubmitting) {
    return <Spinner />;
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-2'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Books Hub Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex flex-col space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
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
            <div className='flex flex-col space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Re-enter your password'
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
              variant='green'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <div className='mt-8 flex justify-between items-center'>
            <Link
              href='/forgot-password'
              className='hover:underline text-red-700'
            >
              <Text tag='p'>Reset Password?</Text>
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

export default RegisterForm;
