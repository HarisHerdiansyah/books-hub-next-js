'use client';

import { useState } from 'react';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FaThumbtack, FaSpinner } from 'react-icons/fa';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/typography';
import { updatePinnedBooks } from '@/lib/actions';
import { useAsyncToast } from '@/hooks';
import { toasterProps } from '@/lib/constants';

type DataPinTypes = {
  bookId: string;
  title: string;
  isPin: boolean;
};

type StateType = { lists: DataPinTypes[]; newData: DataPinTypes[] };

export default function PinBooksPopover({ dataBooks }: { dataBooks: Book[] }) {
  const MAX_PIN = 6;
  const dataLists = dataBooks.map((book) => ({
    bookId: book.bookId,
    title: book.title,
    isPin: book.isPin,
  }));

  const { execute, loading } = useAsyncToast();
  const [open, setOpen] = useState(false);
  const [dataPin, setDataPin] = useState<StateType>({
    lists: dataLists,
    newData: [],
  });

  const onChecked = (checked: boolean, id: string) => {
    const { lists, newData } = { ...dataPin };
    const listsIndex = lists.findIndex((book) => book.bookId === id);
    const newDataIndex = newData.findIndex((book) => book.bookId === id);

    lists[listsIndex].isPin = checked;

    if (newDataIndex === -1) {
      setDataPin((prev) => ({
        lists,
        newData: [
          ...prev.newData,
          { bookId: id, title: lists[listsIndex].title, isPin: checked },
        ],
      }));
      return;
    }

    newData[newDataIndex].isPin = checked;
    setDataPin({ lists, newData });
    return;
  };

  const onUpdatePin = () => {
    execute(
      async () => await updatePinnedBooks(dataPin.newData),
      toasterProps.updatePinnedBooks
    ).finally(() => setOpen(false));
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='purple'>
          <FaThumbtack />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Pin Books</DialogTitle>
        </DialogHeader>
        <ul className='list-disc list-inside text-sm'>
          <li>You only can pin 6 books.</li>
          <li>
            Only book that already mark as done that will be shown to other
            users
          </li>
        </ul>
        <div className='h-[300px] overflow-y-auto'>
          <div className='space-y-4'>
            {dataPin.lists.map((book) => (
              <div className='flex items-center space-x-3' key={book.bookId}>
                <Checkbox
                  onCheckedChange={(checked) =>
                    onChecked(checked as boolean, book.bookId)
                  }
                  id={book.title}
                  defaultChecked={book.isPin}
                  disabled={
                    dataPin.lists.filter((book) => book.isPin).length >=
                      MAX_PIN && !book.isPin
                  }
                />
                <Label htmlFor={book.title} className='font-normal'>
                  {book.title}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant='purple' onClick={onUpdatePin}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
