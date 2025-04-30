import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

interface UserSidebarProps {
   activeTab: string
   setActiveTab: (tab: string) => void
}

export default function UserSidebar({ activeTab, setActiveTab }: UserSidebarProps) {
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
               <p className='text-lg font-semibold'>Name</p>
               <p className='text-sm text-gray-400'>Mail</p>
            </div>
         </CardHeader>
         <Separator className='bg-[var(--color-gray-800)]' />
         <CardContent>
            <ul className='mt-4 flex flex-col gap-y-2'>
               <li>
                  <Button
                     variant={activeTab === 'profile' ? 'primary' : 'text'}
                     onClick={() => setActiveTab('profile')}
                  >
                     Profile
                  </Button>
               </li>
               <li>
                  <Button
                     variant={activeTab === 'transaction' ? 'primary' : 'text'}
                     onClick={() => setActiveTab('transaction')}
                  >
                     Transaction
                  </Button>
               </li>
            </ul>
         </CardContent>
         <Separator className='bg-[var(--color-gray-800)]' />
         <CardFooter>
            <Button variant='text'>Logout</Button>
         </CardFooter>
      </Card>
   )
}
