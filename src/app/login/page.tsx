'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginStepOneSchema, loginStepTwoSchema } from '@/schema/loginSchema'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import Text from '@/components/ui/text'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'

const LoginPage: React.FC = () => {
   // Sterowanie krokami logowania (email/telefon -> hasło)
   const [step, setStep] = useState<'email' | 'password'>('email')
   const [emailOrPhone, setEmailOrPhone] = useState('')
   const [isSavePasswordChecked, setIsSavePasswordChecked] = useState(false)
   const { data: session, status } = useSession()
   const router = useRouter()

   useEffect(() => {
      if (status === 'authenticated') {
         router.push('/user-profile')
      }
   }, [status, router])

   const formStepOne = useForm({
      resolver: zodResolver(loginStepOneSchema),
      defaultValues: {
         emailOrPhone: '',
      },
   })

   const formStepTwo = useForm({
      resolver: zodResolver(loginStepTwoSchema),
      defaultValues: {
         password: '',
      },
   })

   const handleCheckUser = async (data: { emailOrPhone: string }) => {
      try {
         const response = await fetch('/api/check-user', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailOrPhone: data.emailOrPhone }),
         })

         const responseData = await response.json()
         console.log('API response:', responseData)

         if (response.ok && responseData.success && responseData.message === 'User exists') {
            setEmailOrPhone(data.emailOrPhone)
            setStep('password')
         } else {
            formStepOne.setError('emailOrPhone', { type: 'manual', message: responseData.message || 'User not found' })
         }
      } catch (err) {
         console.error('Error in handleNextStep:', err)
         toast.error('Something went wrong. Please try again later.')
      }
   }

   const handleVerifyPassword = async (data: { password: string }) => {
      try {
         const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailOrPhone, password: data.password }),
         })

         const responseData = await response.json()
         console.log('response', response)
         console.log('responseData', responseData)

         console.log('SignIn - Sending data:', {
            emailOrPhone,
            password: data.password,
            savePassword: isSavePasswordChecked,
         })

         if (response.ok && responseData.success) {
            const signInResponse = await signIn('credentials', {
               redirect: false,
               emailOrPhone,
               password: data.password,
               savePassword: isSavePasswordChecked,
            })

            console.log('NextAuth sign-in response:', signInResponse)

            if (signInResponse?.error) {
               toast.error('Login failed. Please try again.')
               return
            }

            toast.success('Successfully logged in!')
            router.push('/user-profile')
         } else {
            formStepTwo.setError('password', {
               type: 'manual',
               message: responseData.message || 'Invalid credentials',
            })
         }
      } catch (err) {
         console.error('Error in handleVerifyPassword:', err)
         toast.error('Something went wrong. Please try again later.')
      }
   }

   if (status === 'authenticated') {
      return <p>Redirecting...</p>
   }

   const handleSavePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsSavePasswordChecked(event.target.checked)
   }

   console.log('Current step:', step)
   console.log('Is Save Password checked:', isSavePasswordChecked)
   console.log('Session data from useSession:', session)
   return (
      <div className='my-20 flex flex-col items-center justify-center gap-y-8'>
         <Text as='p' variant='h2semiBold'>
            <span className='text-[var(--color-primary-400)]'>Nexus</span>
            <span className='text-[var(--color-neutral-900)]'>Hub</span>
         </Text>
         <Card className='w-full max-w-md rounded-md border-0 bg-[var(--color-gray-900)] p-6 text-[var(--color-base-white)] shadow-lg'>
            <CardHeader className='px-0'>
               <CardTitle className='text-2xl leading-9 font-medium tracking-[-0.01em]'>
                  {step === 'email' ? 'Sign In' : 'Enter your password'}
               </CardTitle>
               <Separator className='bg-[var(--color-gray-800)]' />
            </CardHeader>
            <CardContent className='px-0'>
               {step === 'email' ? (
                  <Form {...formStepOne}>
                     <form onSubmit={formStepOne.handleSubmit(handleCheckUser)} className='flex flex-col gap-y-6'>
                        <FormField
                           control={formStepOne.control}
                           name='emailOrPhone'
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Email or mobile phone number</FormLabel>
                                 <FormControl>
                                    <Input
                                       variant='custom'
                                       state={formStepOne.formState.errors.emailOrPhone ? 'error' : 'neutral'}
                                       placeholder='Email or mobile phone number'
                                       {...field}
                                       error={formStepOne.formState.errors.emailOrPhone?.message}
                                    />
                                 </FormControl>
                                 {/* <FormMessage /> */}
                              </FormItem>
                           )}
                        />
                        <Button variant='fill' size='XXL' type='submit' className='w-full'>
                           Continue
                        </Button>
                     </form>
                  </Form>
               ) : (
                  <Form {...formStepTwo}>
                     <form onSubmit={formStepTwo.handleSubmit(handleVerifyPassword)} className='flex flex-col gap-y-6'>
                        <FormField
                           control={formStepTwo.control}
                           name='password'
                           render={() => (
                              <FormItem>
                                 <FormLabel>Password</FormLabel>
                                 <FormControl>
                                    <Input
                                       type='password'
                                       variant='custom'
                                       state={formStepTwo.formState.errors.password ? 'error' : 'neutral'}
                                       placeholder='Password'
                                       isPassword
                                       value={formStepTwo.getValues('password') || ''}
                                       {...formStepTwo.register('password')}
                                       error={formStepTwo.formState.errors.password?.message}
                                    />
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                        <Button variant='fill' size='XXL' type='submit' className='w-full'>
                           Log in
                        </Button>
                     </form>
                  </Form>
               )}
            </CardContent>
            <CardFooter className='px-0'>
               {step === 'email' ? (
                  <Text as='p' variant='textMregular'>
                     Don’t have an account?{' '}
                     <Text
                        as='a'
                        variant='textMmedium'
                        href='/register'
                        className='text-[var(--color-neutral-900)] hover:underline'
                     >
                        Register
                     </Text>
                  </Text>
               ) : (
                  <div className='flex w-full items-center justify-between'>
                     <div className='flex items-center gap-2'>
                        <div className='modal-order-service-checkbox relative !top-0'>
                           <label htmlFor='savePassword' className='flex cursor-pointer items-center gap-2'>
                              <input
                                 type='checkbox'
                                 id='savePassword'
                                 checked={isSavePasswordChecked}
                                 onChange={handleSavePasswordChange}
                                 className='absolute h-0 w-0 opacity-0'
                              />
                              <span
                                 className={`checkmark flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                                    isSavePasswordChecked
                                       ? 'border-orange-500 bg-orange-500'
                                       : 'border-gray-300 bg-white'
                                 }`}
                              ></span>
                              <Text as='span' variant='textMregular' className='pl-10 text-[var(--color-neutral-100)]'>
                                 Save password
                              </Text>
                           </label>
                        </div>
                     </div>
                     <div>
                        <Text
                           as='a'
                           variant='textMmedium'
                           href='#'
                           className='text-[var(--color-neutral-900)] hover:underline'
                        >
                           Forgot your password?
                        </Text>
                     </div>
                  </div>
               )}
            </CardFooter>
         </Card>
      </div>
   )
}

export default LoginPage
