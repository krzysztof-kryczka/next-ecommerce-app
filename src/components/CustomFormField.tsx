import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CustomFormFieldProps } from '@/types/CustomFormFieldProps'

export default function CustomFormField({
   name,
   type,
   label,
   placeholder,
   classNameInput = 'h-[54px] w-[400px]',
   classNameItem = '',
   disabled = false,
   isPassword = false,
   actionText,
   onActionClick,
}: CustomFormFieldProps) {
   const {
      control,
      formState: { errors },
   } = useFormContext()

   const maskPhoneNumber = (phone: string): string => {
      return phone.replace(/\d(?=\d{2})/g, '∗')
   }

   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={`flex ${classNameItem}`}>
               <FormLabel>{label}</FormLabel>
               <FormControl>
                  <Input
                     type={isPassword ? 'password' : type}
                     variant='custom'
                     state={errors[name] ? 'error' : 'neutral'}
                     placeholder={placeholder}
                     {...field}
                     value={
                        !field.value ? '' : name === 'phone' && disabled ? maskPhoneNumber(field.value) : field.value
                     }
                     isPassword={isPassword}
                     error={typeof errors[name]?.message === 'string' ? errors[name]?.message : undefined}
                     className={`${classNameInput}`}
                     disabled={disabled}
                     actionText={actionText}
                     onActionClick={onActionClick}
                  />
               </FormControl>
            </FormItem>
         )}
      />
   )
}
