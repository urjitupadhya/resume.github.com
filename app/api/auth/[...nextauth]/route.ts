import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Temporarily remove custom adapter to fix loading issue
  // adapter: firebaseAdapter,
  callbacks: {
    async session({ session, token }: any) {
      console.log('NextAuth session callback - token:', token);
      console.log('NextAuth session callback - session before:', session);
      
      if (session?.user) {
        session.user.id = token.sub || token.id;
        console.log('NextAuth session callback - setting user.id to:', session.user.id);
      }
      
      console.log('NextAuth session callback - session after:', session);
      return session;
    },
    async jwt({ token, user, account }: any) {
      console.log('NextAuth jwt callback - token:', token);
      console.log('NextAuth jwt callback - user:', user);
      console.log('NextAuth jwt callback - account:', account);
      
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        console.log('NextAuth jwt callback - setting token.id to:', token.id);
      }
      
      console.log('NextAuth jwt callback - final token:', token);
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
