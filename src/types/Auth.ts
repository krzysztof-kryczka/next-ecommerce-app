import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

export type StepEmailProps = {
   form: UseFormReturn<{ emailOrPhone: string }>
   handleNextStep: (data: { emailOrPhone: string }) => void
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
      isPassword?: boolean
      type?: string
   }[]
   buttonLabel: string
}
