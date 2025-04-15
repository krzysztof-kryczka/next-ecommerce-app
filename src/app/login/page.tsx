'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginStepOneSchema, loginStepTwoSchema } from '@/schema/loginSchema'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { toast } from 'react-toastify'
import { Separator } from '@radix-ui/react-separator'
import { Input } from '@/components/ui/input'

const LoginPage: React.FC = () => {
   // Sterowanie krokami logowania (email/telefon -> hasło)
   const [step, setStep] = useState<'email' | 'password'>('email')
   const [emailOrPhone, setEmailOrPhone] = useState('')
   const [isSavePasswordChecked, setIsSavePasswordChecked] = useState(false)
   const { data: session } = useSession()

   React.useEffect(() => {
      console.log('Active session data:', session)
   }, [session])

   useEffect(() => {
      console.log('Step changed to:', step) // Sprawdzenie zmiany kroku
   }, [step])

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

   const handleNextStep = async (data: { emailOrPhone: string }) => {
      console.log('handleNextStep triggered with:', data.emailOrPhone)

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

   const handleLogin = async (data: { password: string }) => {
      console.log('Attempting login with:', { emailOrPhone, password: data.password })

      const response = await signIn('credentials', {
         redirect: false,
         emailOrPhone,
         password: data.password,
         // Jeśli checkbox "Save Password" jest zaznaczony, sesja trwa 30 dni
         // W przeciwnym razie sesja trwa 1 godzinę
         savePassword: isSavePasswordChecked,
      })

      console.log('SignIn response:', response)

      if (response?.error) {
         console.error('Login error:', response.error)
         toast.error('Invalid credentials')
      } else {
         console.log('Login successful!')
         toast.success('Successfully logged in!')
      }
   }

   const handleSavePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsSavePasswordChecked(event.target.checked)
   }

   console.log('Current step:', step)
   console.log('Is Save Password checked:', isSavePasswordChecked)
   console.log('Session data from useSession:', session)
   return (
      <div className='my-20 flex flex-col items-center justify-center'>
         <p className='semi-bold pb-8 text-center text-[40px]'>
            <span className='text-[var(--color-primary-400)]'>Nexus</span>
            <span className='text-[var(--color-base-white)]'>Hub</span>
         </p>
         <Card className='w-full max-w-md rounded-md border-0 bg-[var(--color-gray-900)] p-6 text-[var(--color-base-white)] shadow-lg'>
            <CardHeader className='px-0'>
               <CardTitle className='text-2xl font-medium'>
                  {step === 'email' ? 'Sign In' : 'Enter your password'}
               </CardTitle>
               <CardDescription className='text-muted-foreground'>
                  <Separator className='my-4 bg-[var(--color-gray-800)]' />
               </CardDescription>
            </CardHeader>
            <CardContent className='px-0'>
               {step === 'email' ? (
                  <Form {...formStepOne}>
                     <form onSubmit={formStepOne.handleSubmit(handleNextStep)} className='flex flex-col gap-y-6'>
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
                     <form onSubmit={formStepTwo.handleSubmit(handleLogin)} className='flex flex-col gap-y-6'>
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
                  <p>
                     Don’t have an account?{' '}
                     <a href='/register' className='text-[var(--color-primary-400)] hover:underline'>
                        Register
                     </a>
                  </p>
               ) : (
                  <div className='flex w-full items-center justify-between'>
                     <div className='flex items-center gap-2'>
                        <input
                           type='checkbox'
                           id='savePassword'
                           checked={isSavePasswordChecked}
                           onChange={handleSavePasswordChange}
                           className='cursor-pointer'
                        />
                        <label htmlFor='savePassword' className='cursor-pointer text-sm text-gray-600'>
                           Save password
                        </label>
                     </div>
                     <div>
                        <a href='#'> Forgot your password?</a>
                     </div>
                  </div>
               )}
            </CardFooter>
         </Card>

         <div>{session ? <p>Logged in as: {session.user?.email}</p> : <p>No active session.</p>}</div>
      </div>
   )
}

export default LoginPage
