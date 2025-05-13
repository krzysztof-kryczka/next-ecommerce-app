'use client'
import { useState, useEffect, useCallback } from 'react'
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
type ApiResponse = {
   success: boolean
   message: string
}
const useFetch = <T>(url: string | null, options?: RequestInit, disableFetch = false, defaultToArray = false) => {
   // const [data, setData] = useState<T | T[]>(defaultToArray ? ([] as T[]) : null)
   const [data, setData] = useState<T | T[]>(defaultToArray ? ([] as T[]) : (null as T))
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const fetchData = useCallback(async () => {
      if (!url || disableFetch) return

      try {
         setLoading(true)
         setError(null)
         console.info(`🔄 Fetching data from: ${url}`)

         const response = await fetch(url, options)
         if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)

         const result: T | T[] = await response.json()
         setData(result)

         return result
      } catch (error) {
         setError(error instanceof Error ? error.message : 'Unknown error')
         console.error('❌ Fetch error:', error)
         return null
      } finally {
         setLoading(false)
      }
   }, [url, disableFetch])

   useEffect(() => {
      fetchData()
   }, [url, disableFetch, fetchData])

   const sendRequest = useCallback(
      async <R extends ApiResponse>(
         method: HTTPMethod,
         requestUrl: string,
         body?: object,
         headers: Record<string, string> = {},
      ): Promise<R> => {
         setLoading(true)
         setError(null)

         try {
            const response = await fetch(requestUrl, {
               method,
               headers: { 'Content-Type': 'application/json', ...headers },
               body: body ? JSON.stringify(body) : undefined,
            })

            const result = await response.json()
            // eslint-disable-next-line no-console
            console.log(`📩 Status API: ${response.status}`, result)

            if (!response.ok) {
               setError(result.message || `Error ${response.status}`)
               return result
            }

            return result
         } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error('❌ Błąd:', errorMessage)
            setError(errorMessage)
            return { success: false, message: errorMessage } as R
         } finally {
            setLoading(false)
         }
      },
      [],
   )

   return {
      data,
      loading,
      error,
      setError,
      fetchData,
      postData: (url: string, body: object, headers: Record<string, string> = {}) =>
         sendRequest<ApiResponse>('POST', url, body, headers),

      deleteData: (url: string, body?: object, headers: Record<string, string> = {}) =>
         sendRequest('DELETE', url, body, headers),
      patchData: (url: string, body: object, headers: Record<string, string> = {}) =>
         sendRequest('PATCH', url, body, headers),
      putData: (url: string, body: object, headers: Record<string, string> = {}) =>
         sendRequest('PUT', url, body, headers),
   }
}

export default useFetch

// import { useState, useEffect } from 'react'

// const useFetch = <T>(url: string | null, options?: RequestInit, disableFetch = false, defaultToArray = false) => {
//    // const [data, setData] = useState<T[]>([])
//    // const [data, setData] = useState<T | T[] | null>(null) // not working
//    const [data, setData] = useState<T | T[]>(defaultToArray ? ([] as T[]) : (null as T))
//    const [loading, setLoading] = useState(false)
//    const [error, setError] = useState<string | null>(null)

//    useEffect(() => {
//       if (!url || disableFetch) return
//       fetchData(url)
//    }, [url])

//    const fetchData = async (url: string) => {
//       try {
//          setLoading(true)
//          setError(null)
//          console.info(`🔄 Fetching data from: ${url}`)
//          const response = await fetch(url, options)
//          if (!response.ok) {
//             const errorMessage = `Error ${response.status}: ${response.statusText}`
//             setError(errorMessage)
//             throw new Error(errorMessage)
//          }
//          // const result: T = await response.json()
//          const result = await response.json()

//          // setData(result)

//          setData(
//             Array.isArray(result) ? (result.length > 0 ? result : []) : Object.keys(result).length > 0 ? result : null,
//          )

//          return result
//       } catch (error) {
//          setError(error instanceof Error ? error.message : 'Unknown error')
//          console.error('❌ Fetch error:', error)
//          return null
//       } finally {
//          setLoading(false)
//       }
//    }

//    const postData = async (postUrl: string, body: object, headers: Record<string, string> = {}) => {
//       return await sendRequest<T>('POST', postUrl, body, headers)
//    }

//    const deleteData = async (deleteUrl: string, body?: object, headers: Record<string, string> = {}) => {
//       return await sendRequest<T>('DELETE', deleteUrl, body, headers)
//    }

//    const patchData = async (patchUrl: string, body: object, headers: Record<string, string> = {}) => {
//       return await sendRequest<T>('PATCH', patchUrl, body, headers)
//    }

//    const putData = async (putUrl: string, body: object, headers: Record<string, string> = {}) => {
//       return await sendRequest<T>('PUT', putUrl, body, headers)
//    }

//    const sendRequest = async <R>(
//       method: string,
//       requestUrl: string,
//       body?: object,
//       headers: Record<string, string> = {},
//    ): Promise<R | null> => {
//       try {
//          setLoading(true)
//          setError(null)

//          const response = await fetch(requestUrl, {
//             method,
//             headers: {
//                'Content-Type': 'application/json',
//                ...headers,
//             },
//             body: body ? JSON.stringify(body) : undefined,
//          })

//          if (!response.ok) {
//             throw new Error(`Failed to ${method} data to ${requestUrl}`)
//          }

//          return await response.json()
//       } catch (error) {
//          setError(error instanceof Error ? error.message : 'Unknown error')
//          console.error(`Error during ${method} request:`, error)
//          return null
//       } finally {
//          setLoading(false)
//       }
//    }

//    return { data, loading, error, fetchData, postData, deleteData, patchData, putData }
// }

// export default useFetch
