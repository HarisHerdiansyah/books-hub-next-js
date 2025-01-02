import api from '@/lib/api';

export async function uploadFile(payload: { photo: File }) {
  const formData = new FormData();
  formData.append('photo', payload.photo);
  return await api.post('/api/upload-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
