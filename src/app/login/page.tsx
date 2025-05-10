'use client'

import React, { useState, useEffect, JSX } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginStepOneSchema, loginStepTwoSchema } from '@/schema/loginSchema'
import { signIn, useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'react-toastify'
import Text from '@/components/ui/text'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { StepEmail } from './StepEmail'
import { StepPassword } from './StepPassword'
import { StepFooter } from './StepFooter'
import useFetch from '@/hooks/useFetch'

const LoginPage = (): JSX.Element => {
   const [step, setStep] = useState<'email' | 'password'>('email')
   const [emailOrPhone, setEmailOrPhone] = useState('')
   const [isSavePasswordChecked, setIsSavePasswordChecked] = useState(false)
   const { status } = useSession()
   const router = useRouter()
   const { postData, error, loading } = useFetch<{ success: boolean; message: string }>('/api/check-user', {}, true)

   useEffect(() => {
      if (status === 'authenticated') {
         router.push('/user-profile')
      }
   }, [status, router])

   const formStepOne = useForm({
      resolver: zodResolver(loginStepOneSchema),
      defaultValues: { emailOrPhone: '' },
   })

   const formStepTwo = useForm({
      resolver: zodResolver(loginStepTwoSchema),
      defaultValues: { password: '' },
   })

   const handleCheckUser = async (data: { emailOrPhone: string }) => {
      try {
         const responseData = await postData('/api/check-user', { emailOrPhone: data.emailOrPhone })
         if (error) {
            toast.error('Unexpected error: No response from server.')
            return
         }
         if (responseData?.success) {
            setEmailOrPhone(data.emailOrPhone)
            setStep('password')
         } else {
            formStepOne.setError('emailOrPhone', { type: 'manual', message: responseData?.message || 'User not found' })
         }
      } catch (err) {
         console.error('Error in handleCheckUser:', err)
         toast.error('Something went wrong. Please try again later.')
      }
   }

   const handleVerifyPassword = async (data: { password: string }) => {
      try {
         const responseData = await postData('/api/login', { emailOrPhone, password: data.password })
         if (error) {
            toast.error('Unexpected error: No response from server.')
            return
         }
         if (responseData?.success) {
            const signInResponse = await signIn('credentials', {
               redirect: false,
               emailOrPhone,
               password: data.password,
               savePassword: isSavePasswordChecked,
            })

            if (signInResponse?.error) {
               toast.error('Login failed. Please try again.')
               return
            }

            toast.success('Successfully logged in!')
            router.push('/user-profile')
         } else {
            formStepTwo.setError('password', {
               type: 'manual',
               message: responseData?.message || 'Invalid credentials',
            })
         }
      } catch (err) {
         console.error('Error in handleVerifyPassword:', err)
         toast.error('Something went wrong. Please try again later.')
      }
   }

   const handleSavePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsSavePasswordChecked(event.target.checked)
   }

   const steps = {
      email: <StepEmail form={formStepOne} handleCheckUser={handleCheckUser} />,
      password: (
         <StepPassword
            form={formStepTwo}
            handleVerifyPassword={handleVerifyPassword}
            isSavePasswordChecked={isSavePasswordChecked}
            handleSavePasswordChange={handleSavePasswordChange}
         />
      ),
   }

   if (status === 'authenticated') {
      return <p>Redirecting...</p>
   }

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
               {loading && <p>Checking user...</p>}
               {steps[step]}
            </CardContent>
            <CardFooter className='px-0'>
               <StepFooter
                  step={step}
                  isSavePasswordChecked={isSavePasswordChecked}
                  handleSavePasswordChange={handleSavePasswordChange}
               />
            </CardFooter>
         </Card>
      </div>
   )
}

export default LoginPage
