import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/schema/registerSchema'
import CountrySelect from '@/components/CountrySelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form'
import { RegisterFormProps } from '@/types/RegisterFormProps'
import { JSX } from 'react'

const RegisterForm = ({ onSubmit }: RegisterFormProps): JSX.Element => {
   const form = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: { email: '', phone: '', password: '', repeatPassword: '', country: '', terms: false },
   })

   const {
      formState: { errors, isSubmitting },
   } = form

   return (
      <Form {...form}>
         <form className='flex flex-col gap-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
               control={form.control}
               name='email'
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input
                           type='email'
                           variant='custom'
                           state={errors.email ? 'error' : 'neutral'}
                           placeholder='Your Email'
                           {...field}
                           error={errors.email?.message}
                        />
                     </FormControl>
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name='phone'
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Mobile Number</FormLabel>
                     <FormControl>
                        <Input
                           type='tel'
                           variant='custom'
                           state={errors.phone ? 'error' : 'neutral'}
                           placeholder='Mobile Number'
                           {...field}
                           error={errors.phone?.message}
                        />
                     </FormControl>
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name='password'
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Password</FormLabel>
                     <FormControl>
                        <Input
                           type='password'
                           variant='custom'
                           state={errors.password ? 'error' : 'neutral'}
                           placeholder='Password'
                           isPassword
                           {...field}
                           error={errors.password?.message}
                        />
                     </FormControl>
                     <FormDescription className='pt-2'>
                        Password at least 8 characters and includes at least 1 upper case letter. 1 lower case
                        letter and 1 number.
                     </FormDescription>
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name='repeatPassword'
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className='block pb-4 text-lg font-medium'>Confirm Password</FormLabel>
                     <FormControl>
                        <Input
                           type='password'
                           variant='custom'
                           state={errors.repeatPassword ? 'error' : 'neutral'}
                           placeholder='Confirm Password'
                           isPassword
                           {...field}
                           error={errors.repeatPassword?.message}
                        />
                     </FormControl>
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name='country'
               render={() => (
                  <FormItem>
                     <FormLabel>Country or Region</FormLabel>
                     <FormControl>
                        <CountrySelect name='country' control={form.control} />
                     </FormControl>
                     {/* <FormMessage /> */}
                     {errors.country && (
                        <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.country.message}</p>
                     )}
                  </FormItem>
               )}
            />
            <div className='pt-2'>
               <FormField
                  control={form.control}
                  name='terms'
                  render={({ field }) => (
                     <FormItem>
                        <label className='relative inline-flex items-start'>
                           {/* Checkbox */}
                           <div className='modal-order-service-checkbox relative'>
                              <input
                                 {...field}
                                 type='checkbox'
                                 id='custom-checkbox'
                                 className='absolute h-6 w-6 opacity-0'
                                 value={field.value ? 'true' : 'false'}
                                 onChange={e => field.onChange(e.target.checked)}
                              />
                              <label htmlFor='custom-checkbox' className='checkmark cursor-pointer'></label>
                           </div>
                           <span className='ml-10 text-sm'>
                              By creating an account, you agree to the{' '}
                              <a href='#' className='text-[var(--color-primary-400)] hover:underline'>
                                 Conditions of Use
                              </a>{' '}
                              and{' '}
                              <a href='#' className='text-[var(--color-primary-400)] hover:underline'>
                                 Privacy Notice
                              </a>
                              .
                           </span>
                        </label>
                        {errors.terms && (
                           <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.terms.message}</p>
                        )}
                     </FormItem>
                  )}
               />
            </div>
            <Button
               variant='fill'
               size='XXL'
               type='submit'
               disabled={isSubmitting}
               className='w-full text-[var(--color-base-white)]'
            >
               {isSubmitting ? 'Processing...' : 'Create Account'}
            </Button>
         </form>
      </Form>
   )
}

export default RegisterForm
