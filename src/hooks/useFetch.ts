import { useState, useEffect } from 'react'

const useFetch = <T>(url: string | null, options?: RequestInit) => {
   const [data, setData] = useState<T[]>([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchData = async () => {
         if (!url) return
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

   return { data, loading, error }
}

export default useFetch
