'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Spinner from '@/components/general/Spinner';
import { Text } from '../typography';
import { updateUserProfile } from '@/service/user';
import { useToast } from '@/hooks';

const isBrowser = typeof window !== 'undefined' && typeof File !== 'undefined';

const profileSchema = z.object({
  bio: z.string().min(1, 'Bio is required.'),
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  about: z.string().max(200, "About can't exceed 200 characters."),
  photo: isBrowser
    ? z
        .instanceof(File)
        .refine(
          (file) => file.size <= 5 * 1024 * 1024,
          'File size should be less than 5MB.'
        )
    : z.any(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const aboutContent = watch('about');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('photo', file);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPhotoPreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateUserProfile(data);
      router.replace(`/${session.data?.user.username}/overview`);
    } catch (e) {
      if (e instanceof AxiosError && 'response' in e) {
        toast({
          variant: 'destructive',
          title: 'Failed input data',
          description: e.response?.data.message,
        });
      }
    }
  };

  return (
    <>
      {isSubmitting && <Spinner />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-2xl mx-auto space-y-6 pb-10'
      >
        <div className='text-center'>
          <Label htmlFor='photo' className='text-xl'>
            Complete your profile!
          </Label>
          <div className='my-4 flex items-center justify-center gap-x-6'>
            {photoPreview ? (
              <div className='w-[160px] h-[160px] border border-black bg-white rounded-full overflow-hidden flex items-center'>
                <Image
                  src={photoPreview}
                  alt='Avatar Preview'
                  width={160}
                  height={160}
                />
              </div>
            ) : (
              <div className='w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center'>
                <span className='text-gray-600'>No Photo</span>
              </div>
            )}
            <Input
              type='file'
              id='photo'
              accept='image/*'
              className='mt-2 max-w-80'
              onChange={handleFileChange}
            />
          </div>
          {errors.photo && (
            <p className='text-red-500 text-sm'>
              {errors.photo.message as string}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor='bio'>Bio</Label>
          <Input
            autoComplete='off'
            className='mt-2'
            id='bio'
            type='text'
            placeholder='Short bio'
            {...register('bio')}
          />
          {errors.bio && (
            <p className='text-red-500 text-sm'>{errors.bio.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            autoComplete='off'
            className='mt-2'
            id='firstName'
            type='text'
            placeholder='Enter your first name'
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className='text-red-500 text-sm'>{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor='lastName'>Last Name</Label>
          <Input
            autoComplete='off'
            className='mt-2'
            id='lastName'
            type='text'
            placeholder='Enter your last name'
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className='text-red-500 text-sm'>{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <div className='flex justify-between items-center'>
            <Label htmlFor='about'>About</Label>
            <Text tag='p'>{aboutContent.length}/200</Text>
          </div>
          <Textarea
            maxLength={200}
            className='mt-2 h-[80px]'
            id='about'
            placeholder='Tell us about yourself'
            {...register('about')}
          />
          {errors.about && (
            <p className='text-red-500 text-sm'>{errors.about.message}</p>
          )}
        </div>
        <div className='flex justify-end'>
          <Button type='submit' variant='blue' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </>
  );
}

export default ProfileForm;
