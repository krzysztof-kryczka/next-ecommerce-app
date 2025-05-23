'use client'
import React, { JSX, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import UserSidebar from './UserSidebar'
import UserAvatar from './UserAvatar'
import useFetch from '@/hooks/useFetch'
import UserUpdateForm from './UserUpdateForm'
import { TabsEnum } from '@/enum/TabsEnum'
import UserAddress from './UserAddress'
import UserTransaction from './UserTransaction'
import TabHeader from './UserTabHeader'
import { User } from '@/types/User'
import LoadingIndicator from '@/components/ui/LoadingIndicator'
import ErrorMessage from '@/components/ui/ErrorMessage'

const UserProfilePage = (): JSX.Element => {
   const { data: session, status } = useSession()
   const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.Profile)
   const { data: userData, loading, error } = useFetch<User>('/api/user-profile')

   const user = Array.isArray(userData) ? userData[0] : userData
   if (status === 'loading' || loading) return <LoadingIndicator />
   if (error) return <ErrorMessage sectionName='data.' errorDetails={error} />

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
                     <TabHeader
                        title='My Profile'
                        description='Organize profile info for account control and security'
                     />
                     <div className='flex gap-x-12'>
                        {session?.user && <UserAvatar session={session} />}
                        <UserUpdateForm userData={user} />
                     </div>
                  </div>
               </TabsContent>
               <TabsContent value='address'>
                  <div className='flex flex-col gap-y-10'>
                     <TabHeader title='Address' description='Complete your address for your ordering purpose.' />
                     <div className='flex gap-x-12'>{session?.user && <UserAddress />}</div>
                  </div>
               </TabsContent>
               <TabsContent value='payment'>
                  <TabHeader title='Payment Method' description='Coming soon...' />
               </TabsContent>
               <TabsContent value='transaction'>
                  <div className='flex flex-col gap-y-10'>
                     <TabHeader title='Transaction' description='View your purchase history and track orders.' />
                     <div className='flex gap-x-12'>{session?.user && <UserTransaction />}</div>
                  </div>
               </TabsContent>
               <TabsContent value='notification'>
                  <TabHeader title='Notification Settings' description='Coming soon...' />
               </TabsContent>
            </Tabs>
         </Card>
      </div>
   )
}

export default UserProfilePage
