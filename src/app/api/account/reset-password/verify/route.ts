/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    jwt.verify(token, process.env.SECRET_TOKEN as string) as JwtPayload;

    return NextResponse.json(
      {
        success: true,
        message: 'Token valid',
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error verifying token', e);
    return NextResponse.json(
      {
        success: false,
        message: 'Token is no longer valid',
      },
      { status: 500 }
    );
  }
}
