import { RegisterFormData } from '@/schema/registerSchema'

export type RegisterFormProps = {
   onSubmit: (data: RegisterFormData) => Promise<void>
}
