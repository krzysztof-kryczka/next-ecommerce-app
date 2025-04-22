import NextAuth, { RequestInternal, SessionStrategy } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'

console.log('NextAuth API initialized!')

export const authOptions = {
   debug: true,
   providers: [
      CredentialsProvider({
         name: 'Credentials',
         credentials: {
            emailOrPhone: { label: 'Email or Phone', type: 'text' },
            password: { label: 'Password', type: 'password' },
         },
         async authorize(
            credentials: Record<'emailOrPhone' | 'password', string> | undefined,
            req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>,
         ) {
            if (!req.body) {
               throw new Error('Request body is undefined')
            }

            const isSavePasswordChecked = req.body.savePassword === 'true'
            console.log('Authorize - Save Password Checked:', isSavePasswordChecked)

            try {
               const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(credentials),
               })

               const responseData = await res.json()
               console.log('Authorize - Response data:', responseData)

               if (res.ok && responseData.success && responseData.data) {
                  console.log('Authorize - Save Password Checked:', isSavePasswordChecked)

                  return {
                     ...responseData.data,
                     savePassword: isSavePasswordChecked,
                  }
               }

               console.error('Authorize - Authorization failed')
               return null
            } catch (err) {
               console.error('Authorize error:', err)
               return null
            }
         },
      }),
   ],
   session: {
      strategy: 'jwt' as SessionStrategy, // Poprawne przypisanie z typem
      maxAge: 3600, // 1 godzina
   },
   callbacks: {
      async jwt({ token, user }) {
         console.log('=== JWT CALLBACK ===')
         console.log('JWT Callback - Token before:', token)
         console.log('JWT Callback - User:', user)

         if (user) {
            token.id = user.id
            token.email = user.email
            token.savePassword = user.savePassword === true
            token.maxAge = user.savePassword ? 30 * 24 * 60 * 60 : 1 * 60 * 60 // 30 dni lub 1 godzina
            token.name = user.name || 'Unknown'
            token.picture = user.picture || './avatar.png'
            console.log('JWT Callback - Save Password:', user.savePassword)
         }
         console.log('Token Payload:', token)
         // Usuń pole encodedToken przed zakodowaniem tokena
         delete token.encodedToken
         // Zakoduj token jako JWT
         const secretKey = process.env.JWT_SECRET
         const encodedToken = jwt.sign(token, secretKey)
         console.log('JWT Callback - Encoded Token:', encodedToken)
         token.encodedToken = encodedToken

         console.log('JWT Callback - Token after:', token)
         return token
      },
      async session({ session, token }) {
         console.log('=== SESSION CALLBACK ===')
         console.log('Session Callback - Token:', token)
         console.log('Session Callback - Session before:', session)

         session.user = {
            id: token.id as string,
            email: token.email as string,
         }
         session.token = token.encodedToken
         session.maxAge = token.maxAge as number
         session.expires = new Date(Date.now() + session.maxAge * 1000).toISOString()
         console.log('Session Callback - Max Age:', session.maxAge)
         console.log('Session Callback - Session after:', session)
         return session
      },
   },
}
export default NextAuth(authOptions)
