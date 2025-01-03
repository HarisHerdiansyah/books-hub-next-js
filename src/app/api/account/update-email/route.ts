/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import emailjs from '@emailjs/nodejs';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, newEmail, password, email } = await req.json();
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

    const token = jwt.sign({}, process.env.SECRET_TOKEN as string, {
      expiresIn: '24h',
    });

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID as string,
      process.env.EMAILJS_TEMPLATE_CONFIRMATION as string,
      {
        name: username,
        action: 'Update Email',
        new_email: newEmail,
        reset_link: `${process.env.BASE_URL}/reset-password?token=${token}`,
        email_receiver: email,
        datetime: DateTime.local().toLocaleString(
          DateTime.DATETIME_FULL_WITH_SECONDS
        ),
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

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
