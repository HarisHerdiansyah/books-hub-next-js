'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAsyncToast } from '@/hooks';
import Spinner from '../general/Spinner';

export default function SignOutBtn() {
  const { execute, loading } = useAsyncToast();

  const onSignOut = () => {
    execute(
      async () => await signOut({ redirect: true, callbackUrl: '/login' })
    );
  };

  return (
    <>
      {loading && <Spinner />}
      <Button variant='white' onClick={onSignOut}>
        Logout
        <FaSignOutAlt />
      </Button>
    </>
  );
}
