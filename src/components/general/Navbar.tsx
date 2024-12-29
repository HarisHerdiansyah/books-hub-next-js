import { FaBook } from 'react-icons/fa';
import { SignOutBtn } from '../auth';
import SearchDialog from './SearchDialog';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Sidebar from './Sidebar';

async function Navbar() {
  const session = await getServerSession(authOptions);
  console.log(session?.user);

  return (
    <nav className='bg-[#392467] text-white px-4 md:px-8 py-4 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Link href={`/${session?.user.username}/overview`}>
          <FaBook size={28} className='hidden md:inline-block' />
        </Link>
        <Sidebar username={session?.user.username as string} />
        <SearchDialog />
      </div>
      <div className='hidden md:flex items-center'>
        <SignOutBtn />
      </div>
    </nav>
  );
}

export default Navbar;
