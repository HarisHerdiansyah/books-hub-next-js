import { useState } from 'react';
import useToast, { Toast } from './use-toast';

export default function useAsyncToast() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const execute = async (
    asyncFn: () => Promise<void>,
    type?: Record<string, Omit<Toast, 'variant'>>
  ) => {
    setLoading(true);
    try {
      await asyncFn();
      if (type) toast({ ...type.resolve, variant: 'success' });
    } catch (e) {
      if (type) toast({ ...type.reject, variant: 'destructive' });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
}
