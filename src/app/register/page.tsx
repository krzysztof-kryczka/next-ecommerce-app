'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { registerSchema, RegisterFormData } from '@/schema/registerSchema'
import { countries } from 'countries-list'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'

const RegisterPage: React.FC = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
   })

   const router = useRouter()

   const [showPassword, setShowPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   const togglePasswordVisibility = () => setShowPassword(prev => !prev)
   const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev)

   const countryNames = Object.values(countries).map(country => country.name)

   const onSubmit = async (data: RegisterFormData) => {
      try {
         const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         })

         if (response.ok) {
            toast.success('Account created successfully!', { className: 'toast-success' })

            // Ustaw flagę z czasem życia (60 sekund)
            const expirationTime = new Date().getTime() + 60 * 1000
            sessionStorage.setItem('registered', JSON.stringify({ expiresAt: expirationTime }))

            router.push('/registration-success')
         } else {
            const error = await response.json()
            toast.error(error.message || 'Failed to create account', { className: 'toast-error' })
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

         <form
            className='flex w-full max-w-md flex-col gap-y-6 rounded-md bg-[var(--color-gray-900)] p-6 text-white shadow-lg'
            onSubmit={handleSubmit(onSubmit)}
         >
            <h2 className='text-left text-2xl font-medium'>Create Account</h2>
            <hr className='border-t border-[var(--color-gray-800)]' />
            <div>
               <label className='block pb-4 text-lg font-medium' htmlFor='email'>
                  Email
               </label>
               <input
                  type='email'
                  id='email'
                  placeholder='Your Email'
                  {...register('email')}
                  className={`w-full rounded-md border bg-[var(--color-gray-900)] px-5 py-3.5 text-base text-[var(--color-base-white)] placeholder-[var(--color-neutral-300)] focus:border-[var(--color-warning-500)] ${errors.email ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-neutral-500)]'}`}
               />
               {errors.email && <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.email.message}</p>}
            </div>
            <div>
               <label className='block pb-4 text-lg font-medium' htmlFor='phone'>
                  Mobile Number
               </label>
               <input
                  type='tel'
                  id='phone'
                  placeholder='Mobile Number'
                  {...register('phone')}
                  className={`w-full rounded-md border bg-[var(--color-gray-900)] px-5 py-3.5 text-base text-[var(--color-base-white)] placeholder-[var(--color-neutral-300)] focus:border-[var(--color-warning-500)] ${errors.phone ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-neutral-500)]'}`}
               />
               {errors.phone && <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.phone.message}</p>}
            </div>
            <div className='mb-4'>
               <label className='block pb-4 text-lg font-medium' htmlFor='password'>
                  Password
               </label>
               <div className='relative'>
                  <input
                     type={showPassword ? 'text' : 'password'}
                     id='password'
                     placeholder='Password'
                     {...register('password')}
                     className={`w-full rounded-md border bg-[var(--color-gray-900)] px-5 py-3.5 text-base text-[var(--color-base-white)] placeholder-[var(--color-neutral-300)] focus:border-[var(--color-warning-500)] ${
                        errors.password ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-neutral-500)]'
                     } relative`}
                  />
                  <span
                     onClick={togglePasswordVisibility}
                     className='absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer text-2xl text-gray-500'
                  >
                     {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
               </div>
               <p className='mt-2 text-base text-gray-400'>
                  Password at least 8 characters and includes at least 1 upper case letter, 1 lower case letter, and 1
                  number.
               </p>
               {errors.password && (
                  <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.password.message}</p>
               )}
            </div>
            <div className='mb-4'>
               <label className='block pb-4 text-lg font-medium' htmlFor='repeatPassword'>
                  Confirm Password
               </label>
               <div className='relative'>
                  <input
                     type={showConfirmPassword ? 'text' : 'password'}
                     id='repeatPassword'
                     placeholder='Confirm Password'
                     {...register('repeatPassword')}
                     className={`w-full rounded-md border bg-[var(--color-gray-900)] px-5 py-3.5 text-base text-[var(--color-base-white)] placeholder-[var(--color-neutral-300)] focus:border-[var(--color-warning-500)] ${
                        errors.repeatPassword ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-neutral-500)]'
                     } relative`}
                  />
                  <span
                     onClick={toggleConfirmPasswordVisibility}
                     className='absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer text-2xl text-gray-500'
                  >
                     {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
               </div>
               {errors.repeatPassword && (
                  <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.repeatPassword.message}</p>
               )}
            </div>
            <div>
               <label className='block pb-4 text-lg font-medium' htmlFor='country'>
                  Country or region
               </label>
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
               {errors.country && (
                  <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.country.message}</p>
               )}
            </div>
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
               {errors.terms && <p className='pt-2 text-sm text-[var(--color-danger-500)]'>{errors.terms.message}</p>}
            </div>

            <Button variant='fill' size={'XXL'} type='submit' className='w-full text-[var(--color-base-white)]'>
               Create Account
            </Button>
         </form>
      </div>
   )
}

export default RegisterPage
