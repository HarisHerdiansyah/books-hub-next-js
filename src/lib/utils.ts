import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AxiosError } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function axiosErrorLogger(e: unknown) {
  if (e instanceof AxiosError) {
    // eslint-disable-next-line no-console
    console.error(e.response?.data?.message);
  }
}

export function filterQueryBuilder(obj: Record<string, string>) {
  const entries = Object.entries(obj).map(([k, v]) => {
    let key;
    if (k === 'favourite') key = 'isFav';
    if (k === 'done') key = 'isDone';
    if (k === 'public') key = 'visibility';
    if (k === 'title') key = k;
    if (k === 'writers') key = 'writersText';
    if (k === 'user') key = 'username'

    if (k !== 'title' && k !== 'writers' && k !== 'user') {
      return [key, v === 'true'];
    } else {
      return [key, { contains: v, mode: 'insensitive' }];
    }
  });
  const queries = Object.fromEntries(entries);
  return queries;
}
