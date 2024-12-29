import api from '@/lib/api';

type UpdateProfilePayload = {
  bio: string;
  firstName: string;
  lastName: string;
  about?: string;
  photo?: File;
};

export async function updateUserProfile(payload: UpdateProfilePayload) {
  const formData = new FormData();

  formData.append('bio', payload.bio);
  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('about', payload.about || '');
  formData.append('photo', payload.photo as File);

  return await api.post('/api/user/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function editUserProfile(payload: Partial<UpdateProfilePayload>) {
  await api.patch('/api/user/update', { ...payload });
}
