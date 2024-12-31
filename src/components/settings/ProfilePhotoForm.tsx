'use client';

import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useToast } from '@/hooks';
import Spinner from '@/components/general/Spinner';
import { uploadFile } from '@/service/upload-file';
import { toasterProps } from '@/lib/constants';
import CropPhotoDialog from './CropPhotoDialog';

export default function ProfilePhotoForm({
  initialImageUrl,
}: {
  initialImageUrl: string;
}) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialImageUrl
  );
  const [avatarFile, setAvatarFile] = useState<File | null>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { update } = useSession();

  const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
        setAvatarFile(file);
        setDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await uploadFile({ photo: avatarFile as File });
      update({ image: response.data.data.imageUrl });
      toast({
        ...toasterProps.uploadPhoto.resolve(),
        variant: 'success',
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError && 'response' in e) {
        toast({
          ...toasterProps.uploadPhoto.reject(e.response?.data.message),
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <CropPhotoDialog
        imgSrc={avatarPreview as string}
        imgFile={avatarFile as File}
        open={dialogOpen}
        setImgSrc={setAvatarPreview}
        setImgFile={setAvatarFile}
        onClose={() => setDialogOpen(false)}
      />
      <form onSubmit={onSubmit} className='space-y-6'>
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
              <Input type='file' accept='image/*' onChange={onAvatarChange} />
            </div>
            <Button type='submit' variant='purple'>
              Save
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
