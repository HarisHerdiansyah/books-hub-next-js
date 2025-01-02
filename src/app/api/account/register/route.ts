/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    const isEmailRegistered = await db.accounts.findUnique({
      where: { email },
    });
    const isUsernameRegistered = await db.accounts.findUnique({
      where: { username },
    });

    if (isEmailRegistered || isUsernameRegistered) {
      return NextResponse.json(
        { success: false, message: 'Username or email is already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = await db.accounts.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    await db.users.create({ data: { username } });

    return NextResponse.json(
      {
        success: true,
        message: 'User successfully registered',
        data: {
          username: newAccount.username,
          email: newAccount.email,
          createdAt: newAccount.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Registration error', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Error registering user',
        error: e,
      },
      { status: 500 }
    );
  }
}
