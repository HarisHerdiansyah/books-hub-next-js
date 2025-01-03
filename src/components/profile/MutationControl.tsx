import Link from 'next/link';
import { DoneBadge, VisibilityBadge, FavouriteBtn } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { FaTrashAlt, FaPen, FaCheck } from 'react-icons/fa';

type MutationControlProps = {
  isDone: boolean;
  visibility: boolean;
  isFav: boolean;
  bookId: string;
  onUpdateFavourite: () => void;
  onMarkBookDone: () => void;
  onDeleteBook: () => void;
};

export default function MutationControl({
  isDone,
  visibility,
  isFav,
  bookId,
  onUpdateFavourite,
  onMarkBookDone,
  onDeleteBook,
}: MutationControlProps) {
  return (
    <>
      <div>
        <DoneBadge isDone={isDone} />
        <VisibilityBadge visibility={visibility} screen='mobile' />
      </div>
      <FavouriteBtn isFav={isFav} action={onUpdateFavourite} screen='mobile' />
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
    </>
  );
}
