'use client'

import { useRouter } from 'next/navigation'
import RegisterForm from './RegisterForm'
import { toast } from 'react-toastify'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RegisterFormData } from '@/schema/registerSchema'
import useFetch from '@/hooks/useFetch'

type RegisterResponse = {
   success: boolean
   message?: string
}

const RegisterPage: React.FC = () => {
   const { postData, error } = useFetch<RegisterResponse>(null)
   const router = useRouter()

   const onSubmit = async (data: RegisterFormData) => {
      try {
         console.log('Registering user with data:', data)
         const response = await postData('/api/register', data)

         if (error) {
            toast.error(error)
         } else if (response?.success) {
            toast.success('Account created successfully!')
            const expiresAt = Date.now() + 60 * 1000 // 60 sekund
            sessionStorage.setItem('registered', JSON.stringify({ expiresAt }))
            router.push('/registration-success')
         } else {
            toast.error(response?.message || 'Failed to create account')
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
               <RegisterForm onSubmit={onSubmit} />
            </CardContent>
            <CardFooter className='px-0 pt-4'>
               Already have an account? <a href='/login'>Log in</a>
            </CardFooter>
         </Card>
      </div>
   )
}

export default RegisterPage
