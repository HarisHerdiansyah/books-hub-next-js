import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { filterQueryBuilder } from '@/lib/utils';
import { Pagination } from '@/components/general';
import { CardSearchResult } from '@/components/search-results';
import { Text } from '@/components/typography';

type Filter = {
  title?: string;
  writers?: string;
  user?: string;
};

async function getResults(page: number, filter: Filter) {
  const OFFSET = 14;
  const session = await getServerSession(authOptions);
  if (!session) return { data: [], total: 0 };

  const q = {
    NOT: {
      userId: session.user.id,
    },
    visibility: true,
    isDone: true,
    ...filterQueryBuilder(filter),
  };

  const totalBooks = await db.books.count({ where: q });
  const dataBooks = await db.books.findMany({
    where: q,
    skip: (page - 1) * OFFSET,
    take: OFFSET,
    select: {
      bookId: true,
      title: true,
      year: true,
      views: true,
      categories: true,
      writers: true,
      username: true,
      userImageUrl: true,
      updatedAt: true,
    },
  });
  return {
    data: dataBooks,
    total: totalBooks,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    title: string;
    writers: string;
    user: string;
    page: string;
  }>;
}) {
  const params = (await searchParams) as Filter & { page: string };
  const { page, ...filter } = params;
  const dataBooks = await getResults(parseInt(page), filter);
  return (
    <div>
      <Text tag='h3'>Search Results ({dataBooks.total}) :</Text>
      <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4 my-5'>
        {dataBooks.data.map((book) => (
          <CardSearchResult key={book.bookId} {...book} />
        ))}
      </div>
      {dataBooks.total > 0 && (
        <Pagination page={parseInt(page)} offset={14} total={dataBooks.total} />
      )}
    </div>
  );
}
