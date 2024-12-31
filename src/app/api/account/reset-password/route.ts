/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

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
