import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const redirectUri =
  process.env.NODE_ENV === "production"
    ? "https%3A%2F%2Fmg-roles-nu.vercel.app%2Fapi%2Fauth%2Fcallback%2Fdiscord"
    : "http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord";

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorizationUrl: `https://discord.com/oauth2/authorize?response_type=code&prompt=none&scope=identify%20email&redirect_uri=${redirectUri}&client_id=${process.env.DISCORD_CLIENT_ID}`,
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
