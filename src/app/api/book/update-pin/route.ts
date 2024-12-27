import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

type Book = {
  bookId: string;
  title: string;
  isPin: boolean;
};

/* eslint-disable no-console */
export async function PATCH(req: Request) {
  try {
    const payload = await req.json();
    const updateTrue = payload.filter((book: Book) => book.isPin);
    const updateFalse = payload.filter((book: Book) => !book.isPin);

    await db.$transaction(async (tx) => {
      await tx.books.updateMany({
        where: {
          bookId: {
            in: updateTrue.map((book: Book) => book.bookId),
          },
        },
        data: {
          isPin: true,
        },
      });
      await tx.books.updateMany({
        where: {
          bookId: {
            in: updateFalse.map((book: Book) => book.bookId),
          },
        },
        data: {
          isPin: false,
        },
      });
    });

    return NextResponse.json(
      { success: true, message: 'Update books success' },
      { status: 201 }
    );
  } catch (e) {
    console.error('Update pinned books error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed update pinned books',
      },
      { status: 500 }
    );
  }
}
