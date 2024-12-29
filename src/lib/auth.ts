import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import { db } from './db';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (cred) => {
        if (!cred?.email || !cred?.password) {
          return null;
        }

        const userAccount = await db.accounts.findUnique({
          where: { email: cred.email },
        });
        if (!userAccount) return null;

        const isValid = await bcrypt.compare(
          cred.password,
          userAccount.password
        );
        if (!isValid) return null;

        const userData = await db.users.findUnique({
          where: { username: userAccount.username },
        });
        if (!userData) return null;
        return {
          id: userData.userId,
          image: userData.imageUrl,
          username: userData.username,
          firstLogin: userAccount.firstLogin,
          fullName: `${userData.firstName} ${userData.lastName}`,
          bio: userData.bio,
          about: userData.about,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        if (session.username) token.username = session.username;
        if (session.image) token.image = session.image;
      }

      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.username = user.username;
        token.firstLogin = user.firstLogin;
        token.fullName = user.fullName;
        token.bio = user.bio;
        token.about = user.about;
      }
      return token;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.username = token.username as string;
        session.user.firstLogin = token.firstLogin as boolean;
        session.user.fullName = token.fullName as string;
        session.user.bio = token.bio as string;
        session.user.about = token.about as string;
      }
      return session;
    },
  },
};
