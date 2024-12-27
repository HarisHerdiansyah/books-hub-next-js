/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const userAccount = await db.accounts.findUnique({ where: { email } });
    if (!userAccount) {
      return NextResponse.json(
        { success: false, message: 'User is not registered' },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, userAccount.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Password is wrong' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login successfully',
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Registration error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Login error',
      },
      { status: 500 }
    );
  }
}
