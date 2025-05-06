import { Control } from 'react-hook-form'

export type CountrySelectProps = {
   name: string
   control: Control<any>
   errors?: Record<string, string>
   className?: string
}
