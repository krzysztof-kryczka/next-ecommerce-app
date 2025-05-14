import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import CustomFormField from '@/components/CustomFormField'
import { UpdateUserFormData, updateUserSchema } from '@/schema/updateSchema'
import { JSX, useState } from 'react'
import { toast } from 'react-toastify'
import { signIn, signOut, useSession } from 'next-auth/react'

interface UserFormProps {
   userData: UpdateUserFormData
}

const UserUpdateForm = ({ userData }: UserFormProps): JSX.Element => {
   const [isEditing, setIsEditing] = useState(false)
   const [isPhoneEditable, setIsPhoneEditable] = useState(false)
   const [isPasswordEditable, setIsPasswordEditable] = useState(false)
   const [isEmailEditable, setIsEmailEditable] = useState(false)
   const [showWarningPopup, setShowWarningPopup] = useState(false)

   const { data: session } = useSession()
   const form = useForm<UpdateUserFormData>({
      resolver: zodResolver(updateUserSchema),
      defaultValues: userData,
   })

   const handleEditStart = (field: 'email' | 'phone' | 'password') => {
      setIsEditing(true)
      if (field === 'email') {
         setShowWarningPopup(true)
      } else if (field === 'phone') {
         setIsPhoneEditable(true)
      } else if (field === 'password') {
         setIsPasswordEditable(true)
         form.setValue('password', '')
      }
   }

   const confirmEmailEdit = () => {
      setShowWarningPopup(false)
      setIsEmailEditable(true)
      setIsPasswordEditable(true)
      form.setValue('password', '')
   }

   const handleCancelEdit = () => {
      setIsEditing(false)
      setIsEmailEditable(false)
      setIsPhoneEditable(false)
      setIsPasswordEditable(false)
      form.reset()
   }

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
            await signOut()
            await signIn(undefined, { callbackUrl: '/login' })
         }
      } else {
         toast.error(
            responseData.message === 'Email already in use'
               ? '❌ This email is already taken.'
               : `❌ Update failed: ${responseData.message}`,
         )
      }
   }

   return (
      <>
         {showWarningPopup && (
            <div className='popup bg-opacity-50 fixed inset-0 flex items-center justify-center bg-gray-800'>
               <div className='rounded-md bg-white p-6 shadow-md'>
                  <p className='font-medium text-red-600'>⚠ Changing your email will log you out.</p>
                  <div className='mt-4 flex justify-end gap-4'>
                     <Button onClick={confirmEmailEdit}>OK, I understand</Button>
                     <Button onClick={() => setShowWarningPopup(false)} variant='outline'>
                        Cancel
                     </Button>
                  </div>
               </div>
            </div>
         )}

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
                  disabled={!isEmailEditable}
                  actionText='Change Email'
                  onActionClick={() => handleEditStart('email')}
               />
               <CustomFormField
                  name='phone'
                  label='Phone Number'
                  type='tel'
                  placeholder='Your Phone'
                  classNameItem='justify-between'
                  disabled={!isPhoneEditable}
                  actionText='Change Phone Number'
                  onActionClick={() => handleEditStart('phone')}
               />
               <CustomFormField
                  name='password'
                  label='Password'
                  type='password'
                  isPassword
                  placeholder='Enter New Password'
                  classNameItem='justify-between'
                  disabled={!isPasswordEditable}
                  actionText='Change Password'
                  onActionClick={() => handleEditStart('password')}
               />

               <div className='flex gap-4'>
                  {isEditing && (
                     <Button variant='outline' onClick={handleCancelEdit}>
                        Cancel
                     </Button>
                  )}
                  <Button variant='fill' type='submit'>
                     Update Profile
                  </Button>
               </div>
            </form>
         </Form>
      </>
   )
}

export default UserUpdateForm
