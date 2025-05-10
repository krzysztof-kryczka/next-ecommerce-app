import { FieldValues } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { StepFormProps } from '@/types/Auth'
import { JSX } from 'react'

export const StepForm = <T extends FieldValues>({
   form,
   handleSubmit,
   fields,
   buttonLabel,
}: StepFormProps<T>): JSX.Element => {
   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-y-6'>
            {fields.map(({ name, label, placeholder, type = 'text' }, index) => (
               <FormField
                  key={index}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                           <Input
                              type={type}
                              variant='custom'
                              state={form.formState.errors[name] ? 'error' : 'neutral'}
                              placeholder={placeholder}
                              {...field}
                              error={form.formState.errors[name]?.message?.toString()}
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
            ))}
            <Button variant='fill' size='XXL' type='submit' className='w-full'>
               {buttonLabel}
            </Button>
         </form>
      </Form>
   )
}
