import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import CustomFormField from '@/components/CustomFormField'
import { UpdateUserFormData, updateUserSchema } from '@/schema/updateSchema'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { signIn, useSession } from 'next-auth/react'

interface UserFormProps {
   userData: any
}

export default function UserUpdateForm({ userData }: UserFormProps) {
   const [isPhoneEditable, setIsPhoneEditable] = useState(false)
   const [isPasswordEditable, setIsPasswordEditable] = useState(false)

   const { data: session } = useSession()
   const form = useForm<UpdateUserFormData>({
      resolver: zodResolver(updateUserSchema),
      defaultValues: userData,
   })

   const onSubmit = async (formData: UpdateUserFormData) => {
      const response = await fetch('/api/user-profile', {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData),
      })

      const responseData = await response.json()

      if (response.ok) {
         toast.success('Profile updated successfully!')

         // Jeśli zmieniono e-mail, wymuś ponowne logowanie, aby odświeżyć sesję
         if (formData.email !== session?.user?.email) {
            await signIn(undefined, { callbackUrl: '/login' })
         }
      } else {
         if (responseData.message === 'Email already in use') {
            toast.error('❌ This email is already taken. Please choose another one.')
         } else {
            toast.error(`❌ Update failed: ${responseData.message}`)
         }
      }
   }

   return (
      <>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-[624px] flex-col gap-y-8'>
               <CustomFormField
                  name='name'
                  label='Name'
                  type='text'
                  placeholder='Your Name'
                  classNameItem='justify-between'
               />
               <CustomFormField
                  name='email'
                  label='Email'
                  type='email'
                  placeholder='Your Email'
                  classNameItem='justify-between'
               />
               <CustomFormField
                  name='phone'
                  label='Phone Number'
                  type='tel'
                  placeholder='Your Phone'
                  classNameItem='justify-between'
                  disabled={!isPhoneEditable}
                  actionText='Change Phone Number'
                  onActionClick={() => setIsPhoneEditable(true)}
               />

               <CustomFormField
                  name='password'
                  label='Password'
                  type='password'
                  isPassword
                  placeholder='Enter Password'
                  classNameItem='justify-between'
                  disabled={!isPasswordEditable}
                  actionText='Change Password'
                  onActionClick={() => setIsPasswordEditable(true)}
               />

               <Button variant='fill' type='submit'>
                  Update Profile
               </Button>
            </form>
         </Form>
      </>
   )
}
