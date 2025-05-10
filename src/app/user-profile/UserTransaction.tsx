'use client'

import { JSX } from 'react'
import { useSession } from 'next-auth/react'
import useFetch from '@/hooks/useFetch'
import TransactionHistory from '@/components/TransactionHistory'
import { Order } from '@/types/Order'

const UserTransactions = (): JSX.Element => {
   const { data: session } = useSession()
   const userId = session?.user?.id

   const { data: response, loading } = useFetch<{ success: boolean; data: Order[] }>(
      userId ? '/api/orders' : null,
      {},
      false,
      true,
   )

   // const orders = response?.success ? response.data : []
   const orders = response && 'data' in response ? response.data : []

   if (!userId) return <p className='text-red-500'>You must log in to view your transaction history.</p>

   return (
      <div className='mx-auto flex w-full flex-col gap-y-6'>
         {loading && <p>Loading orders...</p>}
         {orders.length > 0 ? <TransactionHistory orders={orders} /> : <p>No transactions found.</p>}
      </div>
   )
}

export default UserTransactions
