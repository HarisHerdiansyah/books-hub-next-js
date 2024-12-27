import Image from 'next/image';
import { FaBook } from 'react-icons/fa';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '../typography';
import { db } from '@/lib/db';
import { SignOutBtn } from '../auth';

export default async function Sidebar({ username }: { username: string }) {
  const user = await db.users.findUnique({ where: { username } });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>Prpfile</AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-[300px] bg-[#392467] border-[#392467] flex flex-col'
      >
        <SheetHeader>
          <SheetTitle className='flex text-white'>
            <FaBook size={28} className='mr-2' />
            Books Hub
          </SheetTitle>
        </SheetHeader>
        <div className='text-white rounded-lg overflow-hidden flex flex-col items-center space-y-8 py-4'>
          <div className='rounded-full overflow-hidden'>
            <Image
              src={user?.imageUrl as string}
              alt='Profile'
              width={150}
              height={150}
            />
          </div>
          <div className='w-full'>
            <Text tag='h3'>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text tag='p'>@{user?.username}</Text>
            <Text tag='p'>{user?.bio}</Text>
            <div className='mt-7'>
              <Text tag='h4'>About</Text>
              <p className='leading-6 text-sm text-justify'>{user?.about}</p>
            </div>
          </div>
        </div>
        <SheetFooter className='justify-self-end'>
          <SignOutBtn />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
