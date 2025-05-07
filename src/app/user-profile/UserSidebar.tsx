import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { signOut, useSession } from 'next-auth/react'
import useFetch from '@/hooks/useFetch'
import { User } from '@/types/User'
import { UserSidebarProps } from '@/types/UserSidebarProps'
import { TabsEnum } from '@/enum/TabsEnum'

export default function UserSidebar({ activeTab, setActiveTab }: UserSidebarProps) {
   const { data: session } = useSession()
   const { data: userData } = useFetch<User>('/api/user-profile', {}, false, true)

   if (!userData || Array.isArray(userData)) return null

   return (
      <Card className='flex w-1/4 flex-col gap-y-6 rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
         <CardHeader className='flex items-center gap-x-4'>
            <Image
               src={'https://i.ibb.co/VpPFKGR4/55335c708ac05d8f469894d08e2671fa.jpg'}
               alt={'Default User Avatar'}
               width={60}
               height={60}
               className='rounded-full'
            />
            <div>
               <p className='text-lg font-semibold'>{userData.name}</p>
               <p className='text-sm text-gray-400'>{userData.email}</p>
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
                  <li>
                     <Button
                        variant={activeTab === TabsEnum.Address ? 'fill' : 'text'}
                        onClick={() => setActiveTab(TabsEnum.Address)}
                        className='w-full'
                     >
                        Address
                     </Button>
                  </li>
               </li>
            </ul>
         </CardContent>
         <Separator className='bg-[var(--color-gray-800)]' />
         <CardFooter>
            <Button variant='text' onClick={() => signOut()} className='w-full'>
               Logout
            </Button>
         </CardFooter>
      </Card>
   )
}
