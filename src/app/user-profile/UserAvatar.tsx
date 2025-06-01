import { JSX } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Text from '@/components/ui/text'
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { UserAvatarProps } from '@/types/UserAvatarProps'

const UserAvatar = ({ session }: UserAvatarProps): JSX.Element => {
   return (
      <div className='flex w-full max-w-[220px] flex-col items-center gap-y-3 lg:w-[252px] lg:max-w-none'>
         <Image
            src={session?.user?.image || 'https://i.ibb.co/VpPFKGR4/55335c708ac05d8f469894d08e2671fa.jpg'}
            alt='User Avatar'
            width={220}
            height={220}
            className='rounded-full'
         />
         <AlertDialog>
            <AlertDialogTrigger asChild>
               <Button variant='stroke' className='border-[var(--color-neutral-900)] text-[var(--color-neutral-900)]'>
                  Upload Photo
               </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
               <AlertDialogTitle>Coming Soon!</AlertDialogTitle>
               <AlertDialogDescription>
                  The avatar upload feature will be available in future updates. Stay tuned! 🚀
               </AlertDialogDescription>
               <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogContent>
         </AlertDialog>
         <Text as='p' variant='textMregular' className='text-[var(--color-neutral-100)]'>
            The maximum photo size: <br /> 1MB | Formats: JPEG, PNG
         </Text>
      </div>
   )
}

export default UserAvatar
