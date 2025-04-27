// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
   interface User {
      id: string
      email: string
      savePassword?: boolean
   }

   interface Session {
      user: User
      maxAge?: number
      accessToken?: string
   }

   interface JWT {
      id: string
      email: string
      savePassword?: boolean
      maxAge?: number
   }
}
