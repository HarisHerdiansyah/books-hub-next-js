'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

// Zod schema for validation
const settingsSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username must not exceed 20 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  bio: z.string().optional(),
  about: z.string().max(200, 'About must not exceed 200 characters.'),
  photo: z.instanceof(FileList).optional(),
});

// Infer TypeScript types
type SettingsFormValues = z.infer<typeof settingsSchema>;

function Form() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: SettingsFormValues) => {
    /* eslint-disable no-console */
    console.log('Form Data:', data);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-2'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <div className='flex flex-col items-center'>
                <Label className='mb-3'>Profile Photo</Label>
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt='Avatar Preview'
                    width={100}
                    height={100}
                    className='rounded-full'
                  />
                ) : (
                  <div className='w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center'>
                    <span className='text-gray-600'>No Photo</span>
                  </div>
                )}
              </div>
              <div className='max-w-[300px]'>
                <Input
                  type='file'
                  accept='image/*'
                  {...register('photo')}
                  onChange={(e) => {
                    register('photo').onChange(e);
                    handleAvatarChange(e);
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor='username'>Username</Label>
              <Input
                className='mt-3'
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
                className='mt-3'
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
              <Label htmlFor='password'>Password</Label>
              <Input
                className='mt-3'
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
              <Label htmlFor='bio'>Bio</Label>
              <Input
                className='mt-3'
                id='bio'
                type='text'
                placeholder='Short bio for yourself'
                {...register('bio')}
              />
              {errors.bio && (
                <p className='text-red-500 text-sm'>{errors.bio.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor='about'>About</Label>
              <Textarea
                className='mt-3'
                id='about'
                placeholder='Describe yourself (max 200 characters)'
                {...register('about')}
              />
              {errors.about && (
                <p className='text-red-500 text-sm'>{errors.about.message}</p>
              )}
            </div>
            <div className='flex justify-end'>
              <Button type='submit' variant='purple' disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Form;
