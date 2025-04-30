import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import CustomFormField from '@/components/CustomFormField'
import { UpdateUserFormData, updateUserSchema } from '@/schema/updateSchema'
import Text from '@/components/ui/text'
import { useState } from 'react'

interface UserFormProps {
   userData: any
}

export default function UserUpdateForm({ userData }: UserFormProps) {
   const [isPasswordEditable, setIsPasswordEditable] = useState(false)

   const form = useForm<UpdateUserFormData>({
      resolver: zodResolver(updateUserSchema),
      defaultValues: userData,
   })

   const onSubmit = async (formData: UpdateUserFormData) => {
      await fetch('/api/user-profile', {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData),
      })
      alert('Profile updated successfully!')
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
                  disabled
               />

               <CustomFormField
                  name='email'
                  label='Email'
                  type='email'
                  placeholder='Your Email'
                  classNameItem='justify-between'
                  disabled
               />

               <CustomFormField
                  name='phone'
                  label='Phone Number'
                  type='tel'
                  placeholder='Your Phone'
                  classNameItem='justify-between'
                  disabled
               />

               <CustomFormField
                  name='password'
                  label='Password'
                  type='password'
                  isPassword
                  placeholder='Enter Password'
                  classNameItem='justify-between'
                  disabled={!isPasswordEditable}
               />

               <Text
                  as='p'
                  variant='textMmedium'
                  onClick={() => setIsPasswordEditable(true)}
                  className='text-[var(--color-primary-400)]'
               >
                  Change Password
               </Text>

               <Button variant='fill' type='submit'>
                  Update Profile
               </Button>
            </form>
         </Form>
      </>
   )
}
