/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, newPassword } = body;

    const user = await db.accounts.findUnique({
      where: { email },
      select: { password: true },
    });

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password as string
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Curent password is incorrect',
        },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.accounts.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Reset password successfully',
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('Error updating password', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating password',
      },
      { status: 500 }
    );
  }
}
