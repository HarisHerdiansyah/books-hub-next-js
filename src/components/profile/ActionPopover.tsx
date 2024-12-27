import Link from 'next/link';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FaEllipsisV, FaTrashAlt, FaPen, FaCheck } from 'react-icons/fa';

type ActionPopoverType = {
  bookId: string;
  deleteAction: () => void;
  markDoneAction: () => void;
};

export default function ActionPopover({
  bookId,
  deleteAction,
  markDoneAction,
}: ActionPopoverType) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FaEllipsisV size={18} className='sm:hidden' />
      </PopoverTrigger>
      <PopoverContent align='end' className='space-x-1'>
        <Button variant='red' size='sm' onClick={deleteAction}>
          <FaTrashAlt /> Delete
        </Button>
        <Link href={`/book-form?mode=edit&bookId=${bookId}`}>
          <Button variant='yellow' size='sm'>
            <FaPen /> Edit
          </Button>
        </Link>
        <Button variant='green' size='sm' onClick={markDoneAction}>
          <FaCheck /> Done
        </Button>
      </PopoverContent>
    </Popover>
  );
}
