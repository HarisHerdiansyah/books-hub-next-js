import api from '@/lib/api';
import { axiosErrorLogger } from '@/lib/utils';
// import { redirect } from 'next/navigation';

type UpdateProfilePayload = {
  bio: string;
  firstName: string;
  lastName: string;
  about?: string;
  photo?: File;
};

export async function updateUserProfile(payload: UpdateProfilePayload) {
  try {
    const formData = new FormData();

    formData.append('bio', payload.bio);
    formData.append('firstName', payload.firstName);
    formData.append('lastName', payload.lastName);
    formData.append('about', payload.about || '');
    formData.append('photo', payload.photo as File);

    const response = await api.post('/api/user/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (e) {
    axiosErrorLogger(e);
  }
}

export async function editUserProfile(payload: Partial<UpdateProfilePayload>) {
  await api.patch('/api/user/update', { ...payload });
}
