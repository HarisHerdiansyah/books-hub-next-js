/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    image: string;
    username: string;
    firstLogin: boolean;
    fullName: string;
    bio: string;
    about: string | null;
  }
  interface Session {
    user: User;
  }
}
