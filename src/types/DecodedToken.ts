export type DecodedToken = {
   id: number
   email: string
   name?: string
   picture?: string
   // [key: string]: any
   additionalClaims?: Record<string, unknown>
}
