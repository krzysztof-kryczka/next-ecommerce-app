export type CustomFormFieldProps = {
   name: string
   type?: string
   label: string
   value?: string
   placeholder?: string
   classNameInput?: string
   classNameItem?: string
   disabled?: boolean
   isPassword?: boolean
   actionText?: string
   onActionClick?: () => void
}
