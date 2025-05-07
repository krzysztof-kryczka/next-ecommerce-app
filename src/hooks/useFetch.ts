import { useState, useEffect } from 'react'

const useFetch = <T>(url: string | null, options?: RequestInit, disableFetch = false, defaultToArray = false) => {
   // const [data, setData] = useState<T[]>([])
   // const [data, setData] = useState<T | T[] | null>(null) // not working
   const [data, setData] = useState<T | T[]>(defaultToArray ? ([] as T[]) : (null as T))
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      if (!url || disableFetch) return
      fetchData(url)
   }, [url])

   const fetchData = async (url: string) => {
      try {
         setLoading(true)
         setError(null)
         console.log(`🔄 Fetching data from: ${url}`)
         const response = await fetch(url, options)
         if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`
            setError(errorMessage)
            throw new Error(errorMessage)
         }
         // const result: T = await response.json()
         const result = await response.json()

         // setData(result)

         setData(
            Array.isArray(result) ? (result.length > 0 ? result : []) : Object.keys(result).length > 0 ? result : null,
         )

         return result
      } catch (error) {
         setError(error instanceof Error ? error.message : 'Unknown error')
         console.error('❌ Fetch error:', error)
         return null
      } finally {
         setLoading(false)
      }
   }

   const postData = async (postUrl: string, body: object, headers: Record<string, string> = {}) => {
      return await sendRequest<T>('POST', postUrl, body, headers)
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

const sendRequest = async <R>(
   method: string,
   requestUrl: string,
   body?: object,
   headers: Record<string, string> = {},
): Promise<R | null> => {
   try {
      setLoading(true)
      setError(null)

      const response = await fetch(requestUrl, {
         method,
         headers: {
            'Content-Type': 'application/json',
            ...headers,
         },
         body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
         throw new Error(`Failed to ${method} data to ${requestUrl}`)
      }

      return await response.json()
   } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
      console.error(`Error during ${method} request:`, error)
      return null
   } finally {
      setLoading(false)
   }
}


   return { data, loading, error, fetchData, postData, deleteData, patchData, putData }
}

export default useFetch
