import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import { getAuthConfigEnv } from "@/config/env"
import { authRepository } from "@/modules/auth/repository"

const env = getAuthConfigEnv()

const providers: Provider[] = [
  Credentials({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      const user = await authRepository.findByEmail(String(credentials.email))

      if (!user?.passwordHash) {
        return null
      }

      const passwordMatches = await bcrypt.compare(String(credentials.password), user.passwordHash)

      if (!passwordMatches) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        authProvider: user.authProvider,
      }
    },
  }),
]

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const dbUser = await authRepository.upsertGoogleUser(user.email)
        user.id = dbUser.id
      }

      return true
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
      }

      if (user?.email) {
        token.email = user.email
      }

      if (user && "authProvider" in user) {
        token.authProvider = user.authProvider as string
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ""
        session.user.email = token.email ?? ""
        session.user.authProvider = typeof token.authProvider === "string" ? token.authProvider : undefined
      }

      return session
    },
  },
  trustHost: true,
  secret: env.NEXTAUTH_SECRET,
})
