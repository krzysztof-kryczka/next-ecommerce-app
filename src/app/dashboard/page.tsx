'use client'
import { useSession } from 'next-auth/react'

const Dashboard = () => {
   const { data: session, status, } = useSession()

   console.log('Session data:', session)

   if (status === 'authenticated') {
      return <p>Logged in as: {session?.user?.email}</p>
   }

   return <p>No active session.</p>
}

export default Dashboard