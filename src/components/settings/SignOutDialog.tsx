'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import Spinner from '@/components/general/Spinner';
import { Text } from '../typography';
import { useAsyncToast } from '@/hooks';

export default function SignOutDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { execute, loading } = useAsyncToast();

  const onSignOut = () => {
    execute(async () => {
      onClose();
      await signOut({ redirect: true, callbackUrl: '/login' });
    });
  };

  return (
    <>
      {loading && <Spinner />}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account is Updated!</DialogTitle>
          </DialogHeader>
          <Text tag='p'>
            You need to sign out after making changes with this account
          </Text>
          <DialogFooter>
            <Button onClick={onSignOut} variant='purple'>
              Sign Out Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
