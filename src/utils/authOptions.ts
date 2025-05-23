import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
   providers: [
      CredentialsProvider({
         name: 'Credentials',
         credentials: {
            emailOrPhone: { label: 'Email or Phone', type: 'text' },
            password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials, req) {
            if (!req.body) {
               throw new Error('Request body is undefined')
            }

            const isSavePasswordChecked = req.body.savePassword === 'true'

            try {
               const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(credentials),
               })

               const responseData = await res.json()
               // console.log('Debug authorize() - responseData:', responseData)

               if (res.ok && responseData.success && responseData.data) {
                  return {
                     ...responseData.data,
                     savePassword: isSavePasswordChecked,
                  }
               }
               return null
            } catch (err) {
               console.error('Authorize error:', err)
               return null
            }
         },
      }),
   ],
   session: {
      strategy: 'jwt',
      maxAge: 3600,
   },
   jwt: {
      secret: process.env.NEXTAUTH_SECRET,
   },
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.id = user.id ? String(user.id) : undefined
            token.email = String(user.email)
            token.savePassword = Boolean(user.savePassword ?? false)
            token.maxAge = user.savePassword ? 30 * 24 * 60 * 60 : 1 * 60 * 60
         }

         // console.log('Debug JWT Callback - Token:', token)
         return token
      },
      async session({ session, token }) {
         session.user = {
            id: token.id ? String(token.id) : 'Brak ID',
            email: String(token.email),
            name: token.name ?? 'Unknown',
            image: token.picture ?? undefined,
         }
         session.maxAge = Number(token.maxAge) || 3600
         session.expires = new Date(Date.now() + session.maxAge * 1000).toISOString()

         // console.log('Debug session() - Session:', session)
         // console.log(`Sesja wygaśnie o: ${session.expires} (za ${session.maxAge} sekund)`)
         return session
      },
   },
   pages: {
      signIn: '/login',
      signOut: '/',
   },
}
