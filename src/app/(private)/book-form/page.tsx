import { BookForm } from '@/components/book-form';
import { Text } from '@/components/typography';
import { db } from '@/lib/db';

export default async function Page(props: {
  searchParams: Promise<{ mode: string; bookId: string }>;
}) {
  const { mode, bookId } = await props.searchParams;
  const book =
    mode === 'edit' &&
    (await db.books.findUnique({
      where: { bookId },
      include: {
        bookDetail: true,
      },
    }));
  return (
    <>
      <Text tag='h2'>
        {mode == 'add' ? 'Add New Book' : 'Edit Current Book'}
      </Text>
      <div className='mt-8 px-0 sm:px-4 md:px-8'>
        <BookForm mode={mode} book={book || {}} />
      </div>
    </>
  );
}
