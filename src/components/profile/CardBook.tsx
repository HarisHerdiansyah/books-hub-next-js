'use client';

import Link from 'next/link';
import {
  FaTrashAlt,
  FaPen,
  FaCheck,
  FaSpinner,
  FaStar,
  FaRegStar,
} from 'react-icons/fa';
import clsx from 'clsx';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
};

function VisibilityBadge({
  visibility,
  screen,
}: {
  visibility: boolean;
  screen: 'mobile' | 'wide';
}) {
  return (
    <Badge
      variant={visibility ? 'blue' : 'gray'}
      className={clsx('font-bold uppercase', {
        'hidden sm:block': screen === 'wide',
        'sm:hidden': screen === 'mobile',
      })}
    >
      {visibility ? 'Public' : 'Private'}
    </Badge>
  );
}

function FavouriteBtn({
  isFav,
  action,
  screen,
}: {
  isFav: boolean;
  action: () => void;
  screen: 'mobile' | 'wide';
}) {
  return (
    <div
      className={clsx(
        'hover:bg-slate-100 p-1 rounded-lg transition-all duration-300',
        {
          'hidden sm:block': screen === 'wide',
          'sm:hidden': screen === 'mobile',
        }
      )}
      onClick={action}
    >
      {isFav ? (
        <FaStar size={22} color='#EBEB05' className='cursor-pointer' />
      ) : (
        <FaRegStar size={22} color='#EBEB05' className='cursor-pointer' />
      )}
    </div>
  );
}

export default function CardBook({
  bookId,
  title,
  visibility,
  categories,
  writers,
  isDone,
  isFav,
  username,
}: CardBookProps) {
  const { execute, loading } = useAsyncToast();

  const onUpdateFavourite = () => {
    execute(
      async () => await updateFavourite(bookId, !isFav),
      toasterProps.toggleFavourite
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
    <Card className='w-full min-h-[180px] overflow-hidden flex flex-col justify-between border-zinc-300'>
      <CardHeader className='justify-between flex-row'>
        <div className='flex items-center sm:space-x-2'>
          <FavouriteBtn
            isFav={isFav}
            action={onUpdateFavourite}
            screen='wide'
          />
          <Link
            href={`/${username}/detail-book/${bookId}`}
            className='hover:underline'
          >
            <Text tag='h4' className='line-clamp-1'>
              {title}
            </Text>
          </Link>
        </div>
        <VisibilityBadge visibility={visibility} screen='wide' />
        <ActionPopover
          bookId={bookId}
          deleteAction={onDeleteBook}
          markDoneAction={onMarkBookDone}
        />
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
        <div>
          <Badge
            variant={isDone ? 'green' : 'orange'}
            className='font-bold uppercase'
          >
            {isDone ? 'Finished' : 'Unfinished'}
          </Badge>
          <VisibilityBadge visibility={visibility} screen='mobile' />
        </div>
        <FavouriteBtn
          isFav={isFav}
          action={onUpdateFavourite}
          screen='mobile'
        />
        <div className='hidden sm:flex gap-x-2'>
          <Button size='icon' variant='red' onClick={onDeleteBook}>
            <FaTrashAlt />
          </Button>
          <Link href={`/book-form?mode=edit&bookId=${bookId}`}>
            <Button size='icon' variant='yellow'>
              <FaPen />
            </Button>
          </Link>
          {!isDone && (
            <Button size='icon' variant='green' onClick={onMarkBookDone}>
              <FaCheck />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
