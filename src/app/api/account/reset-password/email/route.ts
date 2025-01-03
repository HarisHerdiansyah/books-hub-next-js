/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email } = body;

    const user = await db.accounts.findUnique({ where: { email } });
    const isUserRegistered =
      user?.email === email && user?.username === username;
    if (!isUserRegistered) {
      return NextResponse.json(
        {
          success: false,
          message: 'User is not registered',
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user?.id },
      process.env.SECRET_TOKEN as string,
      {
        expiresIn: '5m',
      }
    );

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID as string,
      process.env.EMAILJS_TEMPLATE_RESET_PASSWORD as string,
      {
        name: username,
        reset_link: `${process.env.BASE_URL}/reset-password?token=${token}`,
        email_receiver: email,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
    return NextResponse.json(
      {
        success: true,
        message: 'Email sent',
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error send email', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Error in sending email',
        error: e,
      },
      { status: 500 }
    );
  }
}