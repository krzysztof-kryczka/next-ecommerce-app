'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { registerSchema, RegisterFormData } from '@/schema/registerSchema'
import { countries } from 'countries-list'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const RegisterPage: React.FC = () => {
   const form = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         email: '',
         phone: '',
         password: '',
         repeatPassword: '',
         country: 'Poland',
      },
   })

   const {
      register,
      formState: { errors, },
   } = form

   const router = useRouter()

   const countryNames = Object.values(countries).map(country => country.name)

   const onSubmit = async (data: RegisterFormData) => {
      try {
         const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(data),
         })

         if (response.ok) {
            toast.success('Account created successfully!', { className: 'toast-success', })

            // Ustaw flagę z czasem życia (60 sekund)
            const expirationTime = new Date().getTime() + 60 * 1000
            sessionStorage.setItem('registered', JSON.stringify({ expiresAt: expirationTime, }))

            router.push('/registration-success')
         } else {
            const error = await response.json()
            toast.error(error.message || 'Failed to create account', { className: 'toast-error', })
         }
      } catch (error) {
         console.error('Error during form submission:', error)
         toast.error('Something went wrong. Please try again later.')
      }
   }

   return (
      <div className='my-[77px] flex flex-col items-center justify-center'>
         <p className='semi-bold pb-8 text-center text-[40px]'>
            <span className='text-[var(--color-primary-400)]'>Nexus</span>
            <span className='text-[var(--color-base-white)]'>Hub</span>
         </p>
         <Card className='w-full max-w-md rounded-md border-0 bg-[var(--color-gray-900)] p-6 text-[var(--color-base-white)] shadow-lg'>
            <CardHeader className='px-0'>
               <CardTitle className='text-2xl font-medium'>Create Account</CardTitle>
               <CardDescription className='text-muted-foreground'>
                  <Separator className='my-4 bg-[var(--color-gray-800)]' />
               </CardDescription>
            </CardHeader>
            <CardContent className='px-0'>
               <Form {...form}>
                  <form className='flex flex-col gap-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                     <FormField
                        control={form.control}
                        name='email'
                        render={({ field, }) => (
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
                        render={({ field, }) => (
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
                        render={({ field, }) => (
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
                        render={({ field, }) => (
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
                                 <select
                                    id='country'
                                    {...register('country')}
                                    className={`w-full rounded-md border bg-[var(--color-gray-900)] px-5 py-3.5 text-base text-[var(--color-base-white)] placeholder-[var(--color-neutral-300)] focus:border-[var(--color-warning-500)] ${errors.country ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-neutral-500)]'}`}
                                 >
                                    {countryNames.map(country => (
                                       <option key={country} value={country}>
                                          {country}
                                       </option>
                                    ))}
                                 </select>
                              </FormControl>
                              {/* <FormMessage /> */}
                              {errors.country && (
                                 <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.country.message}</p>
                              )}
                           </FormItem>
                        )}
                     />
                     <div className='pt-2'>
                        <label className='relative inline-flex items-start'>
                           {/* Checkbox */}
                           <div className='modal-order-service-checkbox relative'>
                              <input
                                 type='checkbox'
                                 {...register('terms')}
                                 id='custom-checkbox'
                                 className='absolute h-6 w-6 opacity-0'
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
                     </div>
                  </form>
               </Form>
            </CardContent>
            <CardFooter className='px-0 pt-4'>
               <Button
                  variant='fill'
                  size={'XXL'}
                  type='submit'
                  onClick={() => form.handleSubmit(onSubmit)()}
                  className='w-full text-[var(--color-base-white)]'
               >
                  Create Account
               </Button>
            </CardFooter>
         </Card>
      </div>
   )
}

export default RegisterPage
