import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form'

export type CountrySelectProps<T extends FieldValues> = {
   name: Path<T>
   control: Control<T>
   errors?: FieldErrors<T>
   className?: string
}
