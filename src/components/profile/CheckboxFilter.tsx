'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

export default function CheckboxFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const onSetParams = (checked: boolean, id: string) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set(id, 'true');
      params.set('page', '1');
    } else {
      params.delete(id);
    }
    replace(`${pathname}?${params.toString()}`);
    return;
  };

  return (
    <div className='mt-3'>
      <div className='flex items-center space-x-2 my-2'>
        <Checkbox
          id='favourite'
          onCheckedChange={(checked) => {
            onSetParams(checked as boolean, 'favourite');
          }}
        />
        <label
          htmlFor='favourite'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Favourite
        </label>
      </div>
      <div className='flex items-center space-x-2 my-2'>
        <Checkbox
          id='done'
          onCheckedChange={(checked) => {
            onSetParams(checked as boolean, 'done');
          }}
        />
        <label
          htmlFor='done'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Done
        </label>
      </div>
      <div className='flex items-center space-x-2 my-2'>
        <Checkbox
          id='public'
          onCheckedChange={(checked) => {
            onSetParams(checked as boolean, 'public');
          }}
        />
        <label
          htmlFor='public'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Public
        </label>
      </div>
    </div>
  );
}
