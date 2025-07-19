// src/lib/auth.ts

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            defaultClub: true,
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Verificar se a conta está ativa
        if (!user.active) {
          throw new Error('Account not activated. Contact administrator.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          defaultClubId: user.defaultClubId,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.defaultClubId = user.defaultClubId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.sub!;
        session.user.defaultClubId = token.defaultClubId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  trustHost: true,
});

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role?: string;
    defaultClubId?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
      defaultClubId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    defaultClubId?: string | null;
  }
}