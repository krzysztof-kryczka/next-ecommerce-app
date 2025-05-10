import { Session } from 'next-auth'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

export type StepEmailProps = {
   form: UseFormReturn<{ emailOrPhone: string }>
   handleCheckUser: (data: { emailOrPhone: string }) => void
}

export type StepPasswordProps = {
   form: UseFormReturn<{ password: string }>
   handleVerifyPassword: (data: { password: string }) => void
   isSavePasswordChecked: boolean
   handleSavePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export type StepFooterProps = {
   step: 'email' | 'password'
   isSavePasswordChecked: boolean
   handleSavePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export type StepFormProps<T extends FieldValues> = {
   form: UseFormReturn<T>
   handleSubmit: (data: T) => void
   fields: {
      name: Path<T>
      label: string
      placeholder: string
      type?: string
   }[]
   buttonLabel: string
}

export type CustomUser = {
   id: string
   email: string
   savePassword?: boolean
   name?: string
   picture?: string
}

export type CustomToken = {
   id?: string
   email?: string | null
   savePassword?: boolean
   maxAge?: number
   name?: string | null
   picture?: string
   encodedToken?: string
}


export type CustomSession = Session & {
   user: {
      id?: string
      email?: string
   }
   accessToken?: string
   maxAge?: number
}
