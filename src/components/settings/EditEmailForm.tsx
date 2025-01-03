'use client';

import { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Spinner from '@/components/general/Spinner';
import { updateEmail } from '@/service/account';
import { useToast } from '@/hooks';
import { toasterProps } from '@/lib/constants';

// Zod schema for validation
const editEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(10, 'Username must be at least 10 characters'),
  newEmail: z.string().email('Invalid email address'),
});

type EditEmailFormValues = z.infer<typeof editEmailSchema>;

export default function EditEmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditEmailFormValues>({
    resolver: zodResolver(editEmailSchema),
  });

  const { toast } = useToast();

  const onSubmit = async (data: EditEmailFormValues) => {
    try {
      await updateEmail(data);
      toast({
        variant: 'success',
        ...toasterProps.updateEmail.resolve(),
      });
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (e: unknown) {
      if (e instanceof AxiosError && 'response' in e) {
        toast({
          variant: 'destructive',
          ...toasterProps.updateEmail.reject(e.response?.data.message),
        });
      }
    }
  };

  return (
    <>
      {isSubmitting && <Spinner />}
      <Card className='w-full border border-[#392467]'>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
              <div>
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
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
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
              <div>
                <Label htmlFor='newEmail'>New Email</Label>
                <Input
                  autoComplete='off'
                  id='newEmail'
                  type='email'
                  placeholder='Enter your new email'
                  {...register('newEmail')}
                />
                {errors.newEmail && (
                  <p className='text-red-500 text-sm'>
                    {errors.newEmail.message}
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
