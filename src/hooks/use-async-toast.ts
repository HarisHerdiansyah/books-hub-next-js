import { useState } from 'react';
import useToast, { Toast } from './use-toast';
import { AxiosError, AxiosResponse } from 'axios';

type ActionToastType = {
  resolve: () => Omit<Toast, 'variant'>;
  // eslint-disable-next-line no-unused-vars
  reject: (msg: string) => Omit<Toast, 'variant'>;
};

export default function useAsyncToast() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const execute = async (
    asyncFn: () => Promise<void> | Promise<AxiosResponse<unknown, unknown>>,
    type?: ActionToastType
  ) => {
    setLoading(true);
    try {
      await asyncFn();
      if (type) toast({ ...type.resolve(), variant: 'success' });
    } catch (e: unknown) {
      if (type && e instanceof AxiosError && e.response)
        toast({
          ...type.reject(e.response.data.message),
          variant: 'destructive',
        });
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
}
