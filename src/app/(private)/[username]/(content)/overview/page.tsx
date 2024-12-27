import { getServerSession, Session } from 'next-auth';
import { CardProfile, CardBook, PinBooksPopover } from '@/components/profile';
import { Text } from '@/components/typography';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Book } from '@/lib/types';

async function getDataBooks(session: Session | null, username: string) {
  const q: { username: string; visibility?: boolean; isDone?: boolean } = {
    username,
  };

  if (session?.user.username !== username) {
    q.visibility = true;
    q.isDone = true;
  }

  return db.books.findMany({
    where: q,
    orderBy: {
      title: 'asc',
    },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { username } = await params;
  const dataBooks = await getDataBooks(session, username);
  const pinnedBooks = dataBooks.filter((book: Book) => book.isPin);

  return (
    <div className='flex py-5 gap-x-6'>
      <div className='hidden md:block w-[300px]'>
        <CardProfile username={username} />
      </div>
      <div className='w-full'>
        <div className='flex items-center gap-x-3 mb-5'>
          {session?.user.username === username ? (
            <>
              <PinBooksPopover dataBooks={dataBooks} />
              <Text tag='h2'>Pinned Books</Text>
            </>
          ) : (
            <Text tag='h2'>Overview</Text>
          )}
        </div>
        {pinnedBooks.length > 0 ? (
          <div className='w-full grid grid-cols-1 xl:grid-cols-2 gap-4'>
            {pinnedBooks.map((book) => (
              <CardBook key={book.bookId} {...book} />
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center h-96'>
            <Text tag='h3'>Lists Empty</Text>
          </div>
        )}
      </div>
    </div>
  );
}
