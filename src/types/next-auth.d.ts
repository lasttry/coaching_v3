import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role?: string
    defaultClubId?: string | null
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: string
      defaultClubId?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    defaultClubId?: string | null
  }
}