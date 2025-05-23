import { AddressFormData } from '@/schema/addressSchema'

export type AddressFormProps = {
   onSubmit: (data: AddressFormData) => void
   initialData?: AddressFormData
   onCancel?: () => void
}
