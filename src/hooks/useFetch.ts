import { useState, useEffect } from 'react'

const useFetch = <T>(url: string | null, options?: RequestInit, disableFetch = false) => {
   const [data, setData] = useState<T[]>([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      if (!url || disableFetch) return
      const fetchData = async () => {
         try {
            setLoading(true)
            setError(null)
            const response = await fetch(url, options)
            if (!response.ok) {
               throw new Error(`Failed to fetch data from ${url}`)
            }
            const result = await response.json()
            setData(result)
         } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error')
            console.error('Error:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchData()
   }, [url])

   const postData = async (postUrl: string, body: object) => {
      try {
         setLoading(true)
         setError(null)
         const response = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
         })
         if (!response.ok) {
            throw new Error(`Failed to post data to ${postUrl}`)
         }
         const result: T = await response.json()
         return result
      } catch (error) {
         setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
         setLoading(false)
      }
   }

   return { data, loading, error, postData }
}

export default useFetch
