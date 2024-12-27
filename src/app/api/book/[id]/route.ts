/* eslint-disable no-console */
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await db.books.findUnique({
      where: { bookId: id },
      include: {
        bookDetail: true,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Success get book',
        data: book,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Get books error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed get book',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { book, bookDetail } = body;

    await db.$transaction(async (tx) => {
      await tx.books.update({ where: { bookId: id }, data: { ...book } });
      await tx.bookDetail.update({
        where: { bookId: id },
        data: { ...bookDetail },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Update book success',
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('Update book error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed update book',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.$transaction(async (tx) => {
      await tx.bookDetail.delete({ where: { bookId: id } });
      await tx.books.delete({ where: { bookId: id } });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Delete book successfully',
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('Delete book error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed delete book',
      },
      { status: 500 }
    );
  }
}
