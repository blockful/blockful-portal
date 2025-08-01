import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email read:org",
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: profile.role ?? "user",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code",
      //   },
      // },
    }),
  ],
  // pages: {
  //   signIn: "/auth/signin",
  //   error: "/auth/error",
  // },
  // callbacks: {
  //   async jwt({ token, account, profile }) {
  //     // Persist the OAuth access_token and or the user id to the token right after signin
  //     if (account) {
  //       token.accessToken = account.access_token;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     // Send properties to the client, like an access_token and user id from a provider.
  //     session.accessToken = token.accessToken;
  //     return session;
  //   },
  // },
});
