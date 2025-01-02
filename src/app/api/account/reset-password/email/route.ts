/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { MailtrapClient } from 'mailtrap';
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

    const mailtrapToken = process.env.MAILTRAP_TOKEN as string;
    const client = new MailtrapClient({
      token: mailtrapToken,
    });

    const sender = {
      email: 'books-hub@books-hub.my.id',
      name: 'Books Hub',
    };

    const recipients = [{ email }];

    client
      .send({
        from: sender,
        to: recipients,
        template_uuid: process.env.MAILTRAP_TEMPLATE as string,
        template_variables: {
          name: username,
          reset_link: `${process.env.BASE_URL}/reset-password?token=${token}`,
        },
      })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));

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
