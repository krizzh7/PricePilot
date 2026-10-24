import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, findUser, verifyPassword } from '@/lib/user-store';
import { emailSchema, passwordSchema } from '@/lib/validations';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Gmail Address', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'hidden' },
      },
      async authorize(credentials) {
        try {
          const email = emailSchema.parse(credentials?.email);
          const password = passwordSchema.parse(credentials?.password);
          const mode = credentials?.mode;

          if (mode === 'signup') {
            if (await findUser(email)) return null;
            const user = await createUser(email, password);
            return { id: user.email, email: user.email };
          }

          if (mode === 'login' && await verifyPassword(email, password)) {
            const user = await findUser(email);
            return user ? { id: user.email, email: user.email } : null;
          }
        } catch {
          return null;
        }

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/auth', error: '/auth' },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.email === 'string') {
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
