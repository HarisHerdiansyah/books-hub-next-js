'use client';

import { Text } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Pagination({
  page,
  offset,
  total,
}: {
  page: number;
  offset: number;
  total: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const onPaginate = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? page - 1 : page + 1;
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    replace(`${pathname}?${params.toString()}`);
    return;
  };

  return (
    <div className='flex items-center space-x-3 my-8 justify-center'>
      <Button
        size='sm'
        variant='outline-dark-blue'
        className='w-24'
        disabled={page === 1}
        onClick={() => onPaginate('prev')}
      >
        <FaChevronLeft />
        Prev
      </Button>
      <Text tag='p' className='font-semibold'>
        {page} of {Math.ceil(total / offset)}
      </Text>
      <Button
        size='sm'
        variant='outline-dark-blue'
        className='w-24'
        disabled={page === Math.ceil(total / offset)}
        onClick={() => onPaginate('next')}
      >
        Next
        <FaChevronRight />
      </Button>
    </div>
  );
}
