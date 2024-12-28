'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

const photoSchema = z.object({
  photo: z.instanceof(FileList).optional(),
});

type PhotoFormValues = z.infer<typeof photoSchema>;

export default function ProfilePhotoForm({
  initialImageUrl,
}: {
  initialImageUrl: string;
}) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialImageUrl
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
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

  const onSubmit = (data: PhotoFormValues) => {
    /* eslint-disable no-console */
    console.log('Photo Form Data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='mt-6 flex flex-col sm:flex-row items-center justify-center gap-4'>
        <div className='flex flex-col items-center'>
          <Label className='mb-3'>Profile Photo</Label>
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt='Avatar Preview'
              width={150}
              height={150}
              className='rounded-full'
            />
          ) : (
            <div className='w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center'>
              <span className='text-gray-600'>No Photo</span>
            </div>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <div className='max-w-[250px]'>
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
          <Button type='submit' variant='purple' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
}
