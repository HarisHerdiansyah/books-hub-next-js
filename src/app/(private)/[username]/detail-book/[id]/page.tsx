import { Text } from '@/components/typography';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function Page({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { username, id } = await params;
  const book = await db.books.findUnique({
    where: {
      bookId: id,
    },
    select: {
      title: true,
      writers: true,
      year: true,
      views: true,
      categories: true,
      bookDetail: {
        select: {
          description: true,
          rating: true,
        },
      },
    },
  });

  return (
    <>
      <Text tag='h3' className='mb-6'>
        <Link
          href={`/${username}/overview`}
          className='hover:underline'
          replace
        >
          @{username}
        </Link>
        /{book?.title}
      </Text>
      <div className='flex items-center space-x-2 my-1'>
        <Text tag='h4'>Title:</Text>
        <Text tag='p' className='text-xl'>
          {book?.title}
        </Text>
      </div>
      <div className='flex items-center space-x-2 my-1'>
        <Text tag='h4'>Writers:</Text>
        <Text tag='p' className='text-xl'>
          {book?.writers.join(', ')}
        </Text>
      </div>
      <div className='flex items-center space-x-2 my-1'>
        <Text tag='h4'>Categories:</Text>
        <Text tag='p' className='text-xl'>
          {book?.categories.join(', ')}
        </Text>
      </div>
      <div className='flex items-center space-x-2 my-1'>
        <Text tag='h4'>Year:</Text>
        <Text tag='p' className='text-xl'>
          {book?.year}
        </Text>
      </div>
      <div className='flex items-center space-x-2 my-1'>
        <Text tag='h4'>Views:</Text>
        <Text tag='p' className='text-xl'>
          {book?.views}
        </Text>
      </div>
      <div className='flex items-center space-x-2 my-1'>
        <Text tag='h4'>Rating:</Text>
        <Text tag='p' className='text-xl'>
          {book?.bookDetail?.rating.toFixed(1)}
        </Text>
      </div>
      <Text tag='h4' className='mt-6 mb-2'>
        Description & Review:
      </Text>
      <Text tag='p' className='text-lg'>
        {book?.bookDetail?.description}
      </Text>
    </>
  );
}
