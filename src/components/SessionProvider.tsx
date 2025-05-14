'use client'
import { SessionProvider as AuthSessionProvider } from 'next-auth/react'
import { JSX } from 'react'

export const SessionProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
   return <AuthSessionProvider>{children}</AuthSessionProvider>
}
