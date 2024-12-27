/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, writers, year, visibility, categories } = body;
    const session = await getServerSession(authOptions);
    const writersText = writers.join(' ');
    console.log('POST ADD NEW BOOK', body);

    await db.$transaction(async (tx) => {
      const newBook = await tx.books.create({
        data: {
          userId: session?.user.id as string,
          title,
          year,
          categories,
          writers,
          visibility,
          writersText,
          username: session?.user.username as string,
          userImageUrl: session?.user.image as string,
        },
      });

      await tx.bookDetail.create({
        data: {
          bookId: newBook.bookId,
          rating: 0.0,
          description: '',
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Add new book successfully',
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('Add book error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed add new book',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const totalBooks = await db.books.count();
    const books = await db.books.findMany({
      skip: 0,
      take: 8,
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Get all book success',
        data: books,
        total: totalBooks,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Get all books error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed get all books',
      },
      { status: 500 }
    );
  }
}
