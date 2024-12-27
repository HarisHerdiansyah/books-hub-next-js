import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Suspense } from 'react';
import { FaPlus } from 'react-icons/fa';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { filterQueryBuilder } from '@/lib/utils';
import { Book } from '@/lib/types';
import {
  CardBook,
  FilterPopover,
  SearchPopover,
} from '@/components/profile';
import { Text } from '@/components/typography';
import { Pagination } from '@/components/general';
import { ListLoader } from '@/components/profile';
import { Button } from '@/components/ui/button';

type Filter = {
  favourite?: string;
  done?: string;
  public?: string;
  title?: string;
  writers?: string;
}; 

async function getAllBooks(
  username: string,
  page: number,
  filter: Filter
): Promise<{ data: Book[]; total: number }> {
  const OFFSET = 8;
  const session = await getServerSession(authOptions);
  if (!session) return { data: [], total: 0 };

  const q = {
    username,
    ...filterQueryBuilder(filter),
  };

  const totalBooks = await db.books.count({ where: q });
  const dataBooks = await db.books.findMany({
    where: q,
    skip: (page - 1) * OFFSET,
    take: OFFSET,
    orderBy: {
      title: 'asc',
    },
  });
  return {
    data: dataBooks,
    total: totalBooks,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{
    favourite?: string;
    done?: string;
    public?: string;
    title?: string;
    writers?: string;
    page: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  const segment = await params;
  const search = (await searchParams) as Filter & { page: string };
  const searchKeys = Object.keys(search);
  const isQueryExist = searchKeys.includes('page') && searchKeys.length === 1;
  const { username } = segment;
  const { page, ...filter } = search;
  const dataBooks = await getAllBooks(
    username,
    parseInt(page),
    filter as Filter
  );

  return (
    <div className='flex py-5 gap-x-6'>
      <div className='w-full'>
        <div className='flex items-center justify-between mb-5 sticky top-3 bg-[#392467] text-white p-2 rounded-lg'>
          <div className='flex items-center gap-x-3'>
            {session?.user.username === username ? (
              <>
                <Link href='/book-form?mode=add'>
                  <Button size='icon' variant='blue'>
                    <FaPlus />
                  </Button>
                </Link>
                <Text tag='h2'>Books</Text>
              </>
            ) : (
              <Text tag='h2'>@{username}&apos;s Books</Text>
            )}
          </div>
          <div className='flex items-center gap-x-3'>
            <SearchPopover />
            <FilterPopover />
            {!isQueryExist && (
              <Button variant='destructive'>
                <Link href={`/${username}/books?page=1`} replace>
                  Clear Filter
                </Link>
              </Button>
            )}
          </div>
        </div>
        {dataBooks.total > 0 ? (
          <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Suspense fallback={<ListLoader />}>
              {dataBooks.data.map((book) => (
                <CardBook key={book.bookId} {...book} />
              ))}
            </Suspense>
          </div>
        ) : (
          <div className='flex items-center justify-center h-96'>
            <Text tag='h3'>Lists Empty</Text>
          </div>
        )}
        {dataBooks.total > 0 && (
          <Pagination
            page={parseInt(page)}
            offset={8}
            total={dataBooks.total}
          />
        )}
      </div>
    </div>
  );
}
