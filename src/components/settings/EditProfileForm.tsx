'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import ProfilePhotoForm from './ProfilePhotoForm';
import { editUserProfile } from '@/service/user';
import Spinner from '../general/Spinner';
import { useToast } from '@/hooks';
import { toasterProps } from '@/lib/constants';
import { AxiosError } from 'axios';

const settingsSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username must not exceed 20 characters.'),
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  bio: z.string().optional(),
  about: z.string().max(200, 'About must not exceed 200 characters.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;
type UserFormProps = {
  about: string | null;
  bio: string;
  imageUrl: string;
  username: string;
  firstName: string;
  lastName: string;
};

function EditProfileForm({ userProps }: { userProps: UserFormProps | null }) {
  const { about, bio, imageUrl, username, firstName, lastName } =
    userProps as UserFormProps;

  const { update } = useSession();
  const { replace } = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      about: about as string,
      bio,
      username,
      firstName,
      lastName,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    const prev = { about, bio, username, firstName, lastName };
    const payload: Partial<SettingsFormValues> = {};

    (Object.keys(prev) as (keyof SettingsFormValues)[]).forEach((k) => {
      if (data[k] !== prev[k]) {
        payload[k] = data[k];
      }
    });
    try {
      await editUserProfile(payload);
      await update({ username: payload.username });
      replace(`/${payload.username}/overview`);
      toast({ ...toasterProps.editProfile.resolve(), variant: 'success' });
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response) {
        toast({
          ...toasterProps.editProfile.reject(e.response.data.message),
          variant: 'destructive',
        });
      }
    }
  };

  if (isSubmitting) {
    return <Spinner />;
  }

  return (
    <Card className='w-full border border-[#392467]'>
      <CardContent>
        <ProfilePhotoForm initialImageUrl={imageUrl} />
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 mt-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                className='mt-3'
                id='firstName'
                type='text'
                placeholder='Enter your firstName'
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className='text-red-500 text-sm'>
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                className='mt-3'
                id='lastName'
                type='text'
                placeholder='Enter your lastName'
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className='text-red-500 text-sm'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
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
  );
}

export default EditProfileForm;
