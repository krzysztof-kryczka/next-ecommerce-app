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
      return await sendRequest<T>('POST', postUrl, body)
   }

   const deleteData = async (deleteUrl: string, body?: object) => {
      return await sendRequest<T>('DELETE', deleteUrl, body)
   }

   const patchData = async (patchUrl: string, body: object) => {
      return await sendRequest<T>('PATCH', patchUrl, body)
   }

   const putData = async (putUrl: string, body: object) => {
      return await sendRequest<T>('PUT', putUrl, body)
   }

   const sendRequest = async <R>(method: string, requestUrl: string, body?: object): Promise<R | null> => {
      try {
         setLoading(true)
         setError(null)
         const response = await fetch(requestUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
         })
         if (!response.ok) {
            throw new Error(`Failed to ${method} data to ${requestUrl}`)
         }
         const result: R = await response.json()
         return result
      } catch (error) {
         setError(error instanceof Error ? error.message : 'Unknown error')
         console.error(`Error during ${method} request:`, error)
         return null
      } finally {
         setLoading(false)
      }
   }

   return { data, loading, error, postData, deleteData, patchData, putData }
}

export default useFetch
