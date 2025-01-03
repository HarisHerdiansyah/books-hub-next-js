/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, newEmail, password } = await req.json();
    const user = await db.accounts.findUnique({
      where: { username },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User is not registered',
        },
        { status: 401 }
      );
    }

    const isPaswordValid = await bcrypt.compare(password, user.password);

    if (!isPaswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid password',
        },
        { status: 403 }
      );
    }

    await db.accounts.update({
      where: { username },
      data: { email: newEmail },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Update email success',
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: 'Faile updating email',
      },
      { status: 500 }
    );
  }
}
