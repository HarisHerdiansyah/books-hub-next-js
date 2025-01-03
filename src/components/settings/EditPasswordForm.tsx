'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Spinner from '@/components/general/Spinner';
import SignOutDialog from './SignOutDialog';
import { updatePassword } from '@/service/account';
import { useToast } from '@/hooks';
import { toasterProps } from '@/lib/constants';

const editPasswordSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match.',
  });

type EditPasswordFormValues = z.infer<typeof editPasswordSchema>;

export default function EditPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditPasswordFormValues>({
    resolver: zodResolver(editPasswordSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const onSubmit = async (data: EditPasswordFormValues) => {
    try {
      await updatePassword(data);
      setOpen(true);
    } catch (e: unknown) {
      if (e instanceof AxiosError && 'response' in e) {
        toast({
          variant: 'destructive',
          ...toasterProps.resetPassword.reject(e.response?.data.message),
        });
      }
    }
  };

  return (
    <>
      {isSubmitting && <Spinner />}
      <SignOutDialog open={open} onClose={() => setOpen(false)} />
      <Card className='w-full border border-[#392467]'>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
              <div>
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
              <div>
                <Label htmlFor='password'>Current Password</Label>
                <Input
                  autoComplete='off'
                  id='password'
                  type='password'
                  placeholder='Enter your current password'
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-red-500 text-sm'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
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
              <div>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  autoComplete='off'
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm your new password'
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className='text-red-500 text-sm'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className='flex justify-end'>
              <Button type='submit' variant='purple' disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
