'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FaSearch } from 'react-icons/fa';
import { Text } from '../typography';

export default function SearchPopover() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const [search, setSearch] = useState<Record<string, string>>({
    key: '',
    value: '',
  });

  const onSelect = (value: string) => {
    setSearch((prev) => ({ ...prev, key: value }));
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch((prev) => ({ ...prev, value: event.target.value }));
  };

  const onSearch = () => {
    const params = new URLSearchParams();
    params.set(search.key, search.value);
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
    return;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon' variant='white'>
          <FaSearch />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end'>
        <div className='bg-white text-neutral-800 rounded-lg overflow-hidden p-1'>
          <Text tag='h4' className='mb-2'>
            Search by:
          </Text>
          <Select onValueChange={onSelect} value={search.key}>
            <SelectTrigger>
              <SelectValue placeholder='Select' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='title'>Title</SelectItem>
              <SelectItem value='writers'>Writer</SelectItem>
            </SelectContent>
          </Select>
          <div className='mt-6 flex space-x-2'>
            <Input
              id='value'
              type='text'
              placeholder='Find'
              value={search.value}
              onChange={onInputChange}
              autoComplete='off'
            />
            <Button
              size='icon'
              variant='blue'
              className='shrink-0'
              onClick={onSearch}
            >
              <FaSearch />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
