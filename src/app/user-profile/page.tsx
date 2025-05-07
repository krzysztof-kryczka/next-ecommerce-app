'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import UserSidebar from './UserSidebar'
import UserAvatar from './UserAvatar'
import { useRouter } from 'next/navigation'
import useFetch from '@/hooks/useFetch'
import UserUpdateForm from './UserUpdateForm'
import { Separator } from '@/components/ui/separator'
import Text from '@/components/ui/text'
import { TabsEnum } from '@/enum/TabsEnum'

export default function UserProfilePage() {
   const router = useRouter()
   const { data: session, status } = useSession()
   const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.Profile)

   useEffect(() => {
      if (status === 'unauthenticated') {
         router.push('/login')
      }
   }, [status])

   const { data: userData, loading, error } = useFetch('/api/user-profile')

   if (status === 'loading' || loading) return <p>Loading...</p>
   if (error) return <p className='text-red-500'>Error: {error}</p>

   return (
      <div className='flex gap-x-10 px-10'>
         {/* LEWY PANEL */}
         <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
         {/* PRAWY PANEL */}
         <Card className='w-3/4 rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
            <Tabs value={activeTab} onValueChange={tab => setActiveTab(tab as TabsEnum)}>
               <TabsList>
                  <TabsTrigger value={TabsEnum.Profile}>User Profile</TabsTrigger>
                  <TabsTrigger value={TabsEnum.Address}>My Address</TabsTrigger>
                  <TabsTrigger value={TabsEnum.Payment}>Payment Method</TabsTrigger>
                  <TabsTrigger value={TabsEnum.Transaction}>Transaction</TabsTrigger>
                  <TabsTrigger value={TabsEnum.Notification}>Notification</TabsTrigger>
               </TabsList>
               <TabsContent value='profile'>
                  <div className='flex flex-col gap-y-10'>
                     <div className='flex flex-col gap-y-2'>
                        <Text as='h6' variant='h6medium' className='text-[var(--color-neutral-900)]'>
                           My Profile
                        </Text>

                        <Text as='p' variant='textMregular' className='text-[var(--color-neutral-100)]'>
                           Organize profile info for account control and security{' '}
                        </Text>
                        <Separator className='mt-2 bg-[var(--color-gray-800)]' />
                     </div>
                     <div className='flex gap-x-12'>
                        {session?.user && <UserAvatar session={session} />}
                        <UserUpdateForm userData={userData} />
                     </div>
                  </div>
               </TabsContent>
               <TabsContent value='address'>
                  <h2 className='text-xl font-bold'>My Address</h2>
                  <p>Coming soon...</p>
               </TabsContent>
               <TabsContent value='payment'>
                  <h2 className='text-xl font-bold'>Payment Method</h2>
                  <p>Coming soon...</p>
               </TabsContent>
               <TabsContent value='transaction'>
                  <h2 className='text-xl font-bold'>Transaction History</h2>
                  <p>Coming soon...</p>
               </TabsContent>
               <TabsContent value='notification'>
                  <h2 className='text-xl font-bold'>Notification Settings</h2>
                  <p>Coming soon...</p>
               </TabsContent>
            </Tabs>
         </Card>
      </div>
   )
}
