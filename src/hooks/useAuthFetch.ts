import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

const useAuthFetch = () => {
   const { data: session } = useSession()
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const fetchWithAuth = async <T>(
      url: string,
      options?: RequestInit,
      parseJson = false,
   ): Promise<Response | T | null> => {
      if (!session) {
         toast.error('You must be logged in to perform this action.')
         setError('User is not authenticated')
         return null
      }

      try {
         setLoading(true)
         const response = await fetch(url, {
            ...options,
            headers: {
               ...options?.headers,
               'Content-Type': 'application/json',
               userid: session.user.id,
               Authorization: `Bearer ${session.accessToken}`,
            },
         })

         return parseJson ? await response.json() : response
      } catch (err) {
         console.error('Error during auth fetch:', err)
         setError(err instanceof Error ? err.message : 'Unknown error')
         toast.error('Something went wrong.')
         return null
      } finally {
         setLoading(false)
      }
   }

   return { fetchWithAuth, loading, error }
}

export default useAuthFetch
