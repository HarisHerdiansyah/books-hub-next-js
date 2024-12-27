import api from '@/lib/api';
import { axiosErrorLogger } from '@/lib/utils';

type AddBookPayload = {
  title: string;
  writers: string[];
  year: number;
  visibility: boolean;
  categories: string[];
};

type UpdateBookPayload = {
  [key: string]: string | number | boolean | string[];
};

export async function addNewBook(payload: AddBookPayload) {
  try {
    await api.post('/api/book', payload);
  } catch (e) {
    axiosErrorLogger(e);
  }
}

export async function updateBook(id: string, payload: UpdateBookPayload) {
  try {
    const { description, ...restPayload } = payload;
    await api.put(`/api/book/${id}`, {
      book: restPayload,
      bookDetail: {
        description,
      },
    });
  } catch (e) {
    axiosErrorLogger(e);
  }
}
