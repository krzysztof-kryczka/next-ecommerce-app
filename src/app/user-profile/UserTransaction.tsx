'use client'

import { JSX } from 'react'
import { useSession } from 'next-auth/react'
import useFetch from '@/hooks/useFetch'
import TransactionHistory from '@/components/TransactionHistory'
import { Order } from '@/types/Order'
import LoadingIndicator from '@/components/ui/LoadingIndicator'

const UserTransactions = (): JSX.Element => {
   const { data: session } = useSession()
   const userId = session?.user?.id

   const { data: response, loading } = useFetch<{ success: boolean; data: Order[] }>(
      userId ? '/api/orders' : null,
      {},
      false,
      true,
      'userTransactionsCache',
   )

   // const orders = response?.success ? response.data : []
   const orders = response && 'data' in response ? response.data : []

   if (!userId) return <p className='text-red-500'>You must log in to view your transaction history.</p>

   return (
      <div className='mx-auto flex w-full flex-col gap-y-4 px-2 py-2 sm:gap-y-6 sm:px-4 sm:py-4 lg:gap-y-6 lg:px-0 lg:py-0'>
         {loading && <LoadingIndicator />}
         {orders.length > 0 ? <TransactionHistory orders={orders} /> : <p>No transactions found.</p>}
      </div>
   )
}

export default UserTransactions
