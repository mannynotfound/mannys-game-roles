import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],

  session: {
    jwt: true,
    maxAge: 365 * 24 * 60 * 60,
  },

  callbacks: {
    async session(session, userOrToken) {
      session.userId = userOrToken.userId;
      return Promise.resolve(session);
    },
    async jwt(token, _user, account, _profile, _isNewUser) {
      if (account?.id) {
        token.userId = account.id;
      }
      return token;
    },
  },

  // Enable debug messages in the console if you are having problems
  debug: false,
});
