'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const guestTabs = ['Overview', 'Books'];
const userTabs = [...guestTabs, 'Settings'];

function Tabs() {
  const pathname = usePathname();
  const params = useParams();
  const { data } = useSession();
  const { username } = params;
  const TABS = data?.user.username === username ? userTabs : guestTabs;

  return (
    <div className='flex justify-end border-b border-gray-300'>
      {TABS.map((tab) => (
        <Link
          key={tab}
          href={`/${username}/${tab.toLowerCase()}${
            tab === 'Books' ? '?page=1' : ''
          }`}
          className={clsx(
            'px-4 py-2 text-lg font-medium focus:outline-none',
            pathname.includes(tab.toLowerCase())
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {tab}
        </Link>
      ))}
    </div>
  );
}

export default Tabs;
