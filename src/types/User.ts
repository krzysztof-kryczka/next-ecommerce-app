export interface User {
   id: number // wymagane dla nextAuth (jwt, session)
   email: string // wymagane dla nextAuth (jwt, session)
   name?: string
   password?: string
   phone?: string
   country?: string
   createdAt?: Date
}
