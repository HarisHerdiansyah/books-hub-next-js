'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
// import { Text } from '../typography';

// Zod schema for validation
const editPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
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

  const onSubmit = (data: EditPasswordFormValues) => {
    /* eslint-disable no-console */
    console.log('Edit Password Form Data:', data);
  };

  return (
    <>
      {/* <div className='bg-[#392467] text-white p-2 rounded-xl mt-10 mb-3'>
        <Text tag='h3'>Edit Password</Text>
      </div> */}
      <Card className='w-full border border-[#392467]'>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
              <div>
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
              <div>
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
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='password'>Password</Label>
                <Input
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
              <div>
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
