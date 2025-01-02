import Image from 'next/image';
import { Text } from '../typography';
import { db } from '@/lib/db';

async function CardProfile({ username }: { username: string }) {
  const user = await db.users.findUnique({ where: { username } });

  return (
    <div className='w-[300px] h-[600px] bg-[#392467] text-white rounded-lg overflow-hidden flex flex-col items-center gap-3 py-4 px-6'>
      <div className='rounded-full overflow-hidden'>
        <Image
          src={user?.imageUrl as string}
          alt='Profile'
          width={200}
          height={200}
          priority
        />
      </div>
      <div className='w-full'>
        <Text tag='h3'>{user?.firstName} {user?.lastName}</Text>
        <Text tag='p'>@{user?.username}</Text>
        <Text tag='p'>{user?.bio}</Text>
        <div className='mt-7'>
          <Text tag='h4'>About</Text>
          <p className='leading-6 text-sm text-justify'>{user?.about}</p>
        </div>
      </div>
    </div>
  );
}

export default CardProfile;
