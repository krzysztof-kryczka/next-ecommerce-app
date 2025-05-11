import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Text from '@/components/ui/text'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { useSession, signOut } from 'next-auth/react'
import { UserSidebarProps } from '@/types/UserSidebarProps'
import { TabsEnum } from '@/enum/TabsEnum'
import { JSX } from 'react'

const UserSidebar = ({ activeTab, setActiveTab }: UserSidebarProps): JSX.Element => {
   const { data: session } = useSession()

   return (
      <Card className='flex w-1/4 flex-col gap-y-6 rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
         <CardHeader className='flex items-center gap-x-4'>
            <Image
               src={session?.user?.image || 'https://i.ibb.co/VpPFKGR4/55335c708ac05d8f469894d08e2671fa.jpg'}
               alt={'Default User Avatar'}
               width={60}
               height={60}
               className='rounded-full'
            />
            <div>
               <Text as='p' variant='textMregular' className='text-[var(--color-neutral-100)]'>
                  {session?.user?.name || 'Unknown'}
               </Text>
               <Text as='p' variant='textMregular' className='text-[var(--color-neutral-100)]'>
                  {session?.user?.email}
               </Text>
            </div>
         </CardHeader>
         <Separator className='bg-[var(--color-gray-800)]' />
         <CardContent>
            <ul className='mt-4 flex flex-col gap-y-2'>
               <li>
                  <Button
                     variant={activeTab === TabsEnum.Profile ? 'fill' : 'text'}
                     onClick={() => setActiveTab(TabsEnum.Profile)}
                     className='w-full'
                  >
                     Profile
                  </Button>
               </li>
               <li>
                  <Button
                     variant={activeTab === TabsEnum.Transaction ? 'fill' : 'text'}
                     onClick={() => setActiveTab(TabsEnum.Transaction)}
                     className='w-full'
                  >
                     Transaction
                  </Button>
               </li>
               <li>
                  <Button
                     variant={activeTab === TabsEnum.Address ? 'fill' : 'text'}
                     onClick={() => setActiveTab(TabsEnum.Address)}
                     className='w-full'
                  >
                     Address
                  </Button>
               </li>
            </ul>
         </CardContent>
         <Separator className='bg-[var(--color-gray-800)]' />
         <CardFooter>
            <Button variant='text' onClick={() => signOut({ callbackUrl: '/' })} className='w-full'>
               Logout
            </Button>
         </CardFooter>
      </Card>
   )
}

export default UserSidebar
