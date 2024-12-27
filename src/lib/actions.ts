/* eslint-disable no-console */
'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';

type NewDataPin = {
  bookId: string;
  title: string;
  isPin: boolean;
};

export async function updateFavourite(id: string, isFav: boolean) {
  try {
    await db.books.update({
      where: { bookId: id },
      data: { isFav },
    });

    revalidatePath('/(private)/[username]/(content)', 'layout');
  } catch (e) {
    throw e;
  }
}

export async function markBookDone(id: string, isDone: boolean) {
  try {
    await db.books.update({
      where: { bookId: id },
      data: { isDone },
    });

    revalidatePath('/(private)/[username]/(content)', 'layout');
  } catch (e) {
    console.log(e);
  }
}

export async function deleteBook(id: string) {
  try {
    await db.$transaction(async (tx) => {
      await tx.bookDetail.delete({ where: { bookId: id } });
      await tx.books.delete({ where: { bookId: id } });
    });

    revalidatePath('/(private)/[username]/(content)', 'layout');
  } catch (e) {
    console.log(e);
  }
}

export async function updatePinnedBooks(payload: NewDataPin[]) {
  try {
    const updateTrue = payload.filter((book: NewDataPin) => book.isPin);
    const updateFalse = payload.filter((book: NewDataPin) => !book.isPin);

    await db.$transaction(async (tx) => {
      await tx.books.updateMany({
        where: {
          bookId: {
            in: updateTrue.map((book: NewDataPin) => book.bookId),
          },
        },
        data: {
          isPin: true,
        },
      });
      await tx.books.updateMany({
        where: {
          bookId: {
            in: updateFalse.map((book: NewDataPin) => book.bookId),
          },
        },
        data: {
          isPin: false,
        },
      });
    });

    revalidatePath('/(private)/[username]/(content)', 'layout');
  } catch (e) {
    console.log(e);
  }
}
