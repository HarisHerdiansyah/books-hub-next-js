'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SearchDialog() {
  const { replace } = useRouter();
  const [search, setSearch] = useState<Record<string, string>>({
    key: '',
    value: '',
  });

  const onSelect = (key: string) => setSearch((prev) => ({ ...prev, key }));

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch((prev) => ({ ...prev, value: event.target.value }));
  };

  const onSearch = () => {
    const params = new URLSearchParams();
    params.set(search.key, search.value);
    params.set('page', '1');
    replace(`/search-results?${params.toString()}`);
    return;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex items-center bg-white text-neutral-800 px-2 py-1 rounded ml-3'>
          <FaSearch size={16} className='mr-2' />
          <input
            type='text'
            className='bg-white border-none outline-none text-neutral-800 cursor-pointer'
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className='my-4'>
          <Select onValueChange={onSelect}>
            <SelectTrigger>
              <SelectValue placeholder='Select' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='title'>Title</SelectItem>
              <SelectItem value='writers'>Writers</SelectItem>
              <SelectItem value='user'>User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='my-4 flex space-x-2'>
          <Input
            id='value'
            type='text'
            placeholder='Find'
            value={search.value}
            onChange={onInputChange}
            autoComplete='off'
          />
          <DialogClose asChild>
            <Button
              size='icon'
              variant='blue'
              className='shrink-0'
              onClick={onSearch}
            >
              <FaSearch />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
