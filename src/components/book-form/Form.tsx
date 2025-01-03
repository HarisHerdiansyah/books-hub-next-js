'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';
import { FaTimes } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Spinner from '@/components/general/Spinner';
import { Text } from '../typography';
import { addNewBook, updateBook } from '@/service/book';
import { CATEGORIES_DROPDOWN, toasterProps } from '@/lib/constants';
import { useAsyncToast } from '@/hooks';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  writers: z.string(),
  year: z
    .number()
    .min(1000, 'Enter a valid year.')
    .max(new Date().getFullYear(), 'Year cannot be in the future.'),
  categories: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, 'At least one category must be selected.'),
  visibility: z
    .string()
    .min(1, 'Please select visibility.')
    .refine((val) => val === 'public' || val === 'private', {
      message: "Visibility must be 'public' or 'private'.",
    }),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters.')
    .optional(),
});

const customStyles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: '0.375rem',
    borderColor: state.isFocused ? 'rgb(59 130 246)' : 'rgb(203 213 225)',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.3)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? 'rgb(59 130 246)' : 'rgb(203 213 225)',
    },
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: (base: any, { isFocused }: any) => ({
    ...base,
    backgroundColor: isFocused ? 'rgb(226 232 240)' : 'transparent',
    color: 'rgb(17 24 39)',
    cursor: 'pointer',
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menu: (base: any) => ({
    ...base,
    borderRadius: '0.375rem',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  }),
};

type AddBookFormValues = z.infer<typeof bookSchema>;
type VisibilityType = 'public' | 'private';
type FormProps = {
  mode: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  book?: any;
};

function Form({ mode, book }: FormProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm<AddBookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title || '',
      year: book.year || '',
      categories: book
        ? CATEGORIES_DROPDOWN.filter((opt) =>
            book.categories?.includes(opt.value)
          )
        : [],
      description: mode == 'edit' ? book.bookDetail.description || '' : '',
      visibility: book.visibility ? 'public' : 'private',
    },
  });

  const [writers, setWriters] = useState<string[]>(book.writers || []);
  const [isWritersEmpty, setIsWritersEmpty] = useState<boolean>(false);

  const router = useRouter();
  const session = useSession();
  const { execute, loading } = useAsyncToast();
  const descriptionContent = watch(
    'description',
    mode == 'edit' ? book.bookDetail.description || '' : ''
  ) as string;

  const onAddWriters = () => {
    const writer = getValues('writers');
    if (writer === '') return;
    setIsWritersEmpty(false);
    setWriters((prev) => [...prev, ...writer.split(', ')]);
    setValue('writers', '');
  };

  const onDeleteWriters = (i: number) => {
    const updatedWriters = [...writers];
    updatedWriters.splice(i, 1);
    setWriters(updatedWriters);
  };

  const onSubmit = async (data: AddBookFormValues) => {
    if (writers.length === 0) {
      setIsWritersEmpty(true);
      return;
    }

    const payload = {
      ...data,
      writers,
      visibility: data.visibility === 'public',
      categories: data.categories.map((ctg) => ctg.value),
    };
    if (mode === 'edit') {
      execute(
        async () => await updateBook(book.bookId, payload),
        toasterProps.editBook
      );
    } else {
      execute(async () => await addNewBook(payload), toasterProps.addNewBook);
    }
    router.replace(`/${session.data?.user.username}/books?page=1`);
  };

  return (
    <>
      {loading && <Spinner />}
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <div>
            <Label htmlFor='title'>Title</Label>
            <Input
              autoComplete='off'
              id='title'
              type='text'
              placeholder='Enter book title'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-red-500 text-sm'>{errors.title.message}</p>
            )}
          </div>
          <div>
            <div className='flex items-end gap-x-4'>
              <div className='w-full'>
                <Label htmlFor='writer'>
                  Writer (For multiple writer, separate with comma)
                </Label>
                <Input
                  autoComplete='off'
                  id='writer'
                  type='text'
                  placeholder='Ex: John Doe, Jessica'
                  {...register('writers')}
                />
              </div>
              <Button
                type='button'
                variant='outline-dark-blue'
                className='w-[80px]'
                onClick={onAddWriters}
              >
                Add
              </Button>
            </div>
            {isWritersEmpty && (
              <p className='text-red-500 text-sm'>Writer is required!</p>
            )}
            <div className='flex gap-3 items-center flex-wrap mt-3'>
              {writers.map((w, i) => (
                <Badge variant='blue' key={w}>
                  {w}
                  <FaTimes
                    className='ml-2 cursor-pointer hover:text-red-600 w-3 h-3'
                    onClick={() => onDeleteWriters(i)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
          <div>
            <Label htmlFor='year'>Year</Label>
            <Input
              id='year'
              type='number'
              placeholder='Enter publication year'
              {...register('year', {
                setValueAs: (value) => parseInt(value, 10),
              })}
            />
            {errors.year && (
              <p className='text-red-500 text-sm'>{errors.year.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='categories'>Categories</Label>
            <Controller
              name='categories'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={CATEGORIES_DROPDOWN}
                  styles={customStyles}
                  placeholder='Select categories'
                />
              )}
            />
            {errors.categories && (
              <p className='text-red-500 text-sm'>
                {errors.categories.message}
              </p>
            )}
          </div>
          <div>
            <Label>Visibility</Label>
            <RadioGroup
              onValueChange={(value: VisibilityType) =>
                setValue('visibility', value)
              }
            >
              <div className='mt-1.5 flex gap-x-6'>
                <div className='flex gap-x-1'>
                  <RadioGroupItem value='public' id='public' />
                  <Label htmlFor='public'>Public</Label>
                </div>
                <div className='flex gap-x-1'>
                  <RadioGroupItem value='private' id='private' />
                  <Label htmlFor='private'>Private</Label>
                </div>
              </div>
            </RadioGroup>
            {errors.visibility && (
              <p className='text-red-500 text-sm'>
                {errors.visibility.message}
              </p>
            )}
          </div>
        </div>
        {mode === 'edit' && book.isDone && (
          <div>
            <div className='flex justify-between items-center'>
              <Label htmlFor='about'>About</Label>
              <Text tag='p'>{descriptionContent?.length}/1000</Text>
            </div>
            <Textarea
              className='h-[250px]'
              maxLength={1000}
              id='description'
              placeholder='Enter book description (max 1000 characters)'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-red-500 text-sm'>
                {errors.description.message}
              </p>
            )}
          </div>
        )}
        <div className='flex justify-between my-20'>
          <Button
            type='button'
            variant='outline-red'
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          <Button type='submit' variant={mode === 'add' ? 'blue' : 'yellow'}>
            {mode === 'add' ? 'Add Book' : 'Edit Book'}
          </Button>
        </div>
      </form>
    </>
  );
}

export default Form;
