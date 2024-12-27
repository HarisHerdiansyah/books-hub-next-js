'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaEye, FaUser } from 'react-icons/fa';
import { Text } from '../typography';

type CardBookProps = {
  bookId: string;
  title: string;
  year: number;
  views: number;
  categories: string[];
  writers: string[];
  username: string;
  userImageUrl: string;
};

export default function CardSearchResult({
  bookId,
  title,
  views,
  categories,
  writers,
  username,
  userImageUrl,
}: CardBookProps) {
  return (
    <Card className='w-full overflow-hidden'>
      <CardHeader className='flex-row space-x-2'>
        <Link href={`/${username}/overview`}>
          <Avatar>
            <AvatarImage src={userImageUrl} />
            <AvatarFallback>
              <FaUser />
            </AvatarFallback>
          </Avatar>
        </Link>
        <Link
          href={`/${username}/detail-book/${bookId}`}
          className='hover:underline'
        >
          <Text tag='h4' className='line-clamp-1'>
            @{username}/{title}
          </Text>
        </Link>
      </CardHeader>
      <CardContent>
        <Text tag='p' className='line-clamp-2'>
          Kategori: {categories.join(', ')}
        </Text>
        <Text tag='p' className='line-clamp-2'>
          Penulis: {writers.join(', ')}
        </Text>
      </CardContent>
      <CardFooter className='justify-between'>
        <div className='flex items-center space-x-2'>
          <FaEye size={22} />
          <Text tag='p' className='font-semibold'>
            {views} view(s)
          </Text>
        </div>
        <Text tag='p'>Updated 2 years ago</Text>
      </CardFooter>
    </Card>
  );
}
