'use client';

import Link from 'next/link';
import { FaSpinner, FaEye } from 'react-icons/fa';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import numbro from 'numbro';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  VisibilityBadge,
  FavouriteBtn,
  MutationControl,
} from '@/components/profile';
import { Text } from '../typography';
import ActionPopover from './ActionPopover';
import { useAsyncToast } from '@/hooks';
import { updateFavourite, markBookDone, deleteBook } from '@/lib/actions';
import { toasterProps } from '@/lib/constants';

type CardBookProps = {
  bookId: string;
  title: string;
  visibility: boolean;
  categories: string[];
  writers: string[];
  isDone: boolean;
  isFav: boolean;
  username: string;
  showControl: boolean;
  views: number;
  updatedAt: Date;
};

export default function CardBook({
  bookId,
  title,
  visibility,
  categories,
  writers,
  isDone,
  isFav,
  username,
  showControl,
  views,
  updatedAt,
}: CardBookProps) {
  const formattedViews =
    views > 999
      ? numbro(views).format({ average: true, mantissa: 1 }).toUpperCase()
      : views;

  const { execute, loading } = useAsyncToast();

  const onUpdateFavourite = () => {
    const { markFavourite, removeFavourite } = toasterProps;
    execute(
      async () => await updateFavourite(bookId, !isFav),
      !isFav ? markFavourite : removeFavourite
    );
  };

  const onMarkBookDone = () => {
    execute(
      async () => await markBookDone(bookId, true),
      toasterProps.setBookDone
    );
  };

  const onDeleteBook = () => {
    execute(async () => await deleteBook(bookId), toasterProps.deleteBook);
  };

  if (loading) {
    return (
      <div
        className='fixed inset-0 flex flex-col items-center justify-center z-50'
        style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
      >
        <FaSpinner color='white' className='animate-spin mb-4' size={36} />
        <Text tag='h3' className='text-white'>
          Loading . . . .
        </Text>
      </div>
    );
  }

  return (
    <Card
      className={clsx('w-full overflow-hidden flex flex-col border-zinc-300', {
        'justify-between min-h-[180px]': showControl,
      })}
    >
      <CardHeader className='justify-between flex-row'>
        <div className='flex items-center sm:space-x-2'>
          {showControl && (
            <FavouriteBtn
              isFav={isFav}
              action={onUpdateFavourite}
              screen='wide'
            />
          )}
          <Link
            href={`/${username}/detail-book/${bookId}`}
            className='hover:underline'
          >
            <Text tag='h4' className='line-clamp-1'>
              {title}
            </Text>
          </Link>
        </div>
        {showControl && (
          <>
            <VisibilityBadge visibility={visibility} screen='wide' />
            <ActionPopover
              bookId={bookId}
              deleteAction={onDeleteBook}
              markDoneAction={onMarkBookDone}
            />
          </>
        )}
      </CardHeader>
      <CardContent>
        <Text tag='p' className='line-clamp-2'>
          Category: {categories.join(', ')}
        </Text>
        <Text tag='p' className='line-clamp-2'>
          Writers: {writers.join(', ')}
        </Text>
      </CardContent>

      <CardFooter className='justify-between'>
        {showControl ? (
          <MutationControl
            isDone={isDone}
            isFav={isFav}
            visibility={visibility}
            bookId={bookId}
            onDeleteBook={onDeleteBook}
            onMarkBookDone={onMarkBookDone}
            onUpdateFavourite={onUpdateFavourite}
          />
        ) : (
          <>
            <div className='flex items-center space-x-2'>
              <FaEye size={22} />
              <Text tag='p' className='font-semibold'>
                {formattedViews} view(s)
              </Text>
            </div>
            <Text tag='p'>
              Updated {DateTime.fromJSDate(updatedAt).toRelativeCalendar()}
            </Text>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
