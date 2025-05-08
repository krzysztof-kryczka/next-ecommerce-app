'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { Address } from '@/types/Address'
import useFetch from '@/hooks/useFetch'
import { toast } from 'react-toastify'
import AddressForm from '@/components/AddressForm'
import AddressList from '@/components/AddressList'

export default function UserAddresses() {
   const [addresses, setAddresses] = useState<Address[]>([])
   const [editingAddress, setEditingAddress] = useState<Address | null>(null)
   const [isEditing, setIsEditing] = useState(false)

   const { data: session } = useSession()
   const userId = session?.user?.id

   const { error, loading, fetchData, putData, deleteData } = useFetch<{
      success: boolean
      addresses: Address[]
   }>(
      userId ? `/api/addresses?userId=${userId}` : null,
      {
         headers: {
            Authorization: `Bearer ${session?.accessToken}`,
         },
      },
      !userId,
      true,
   )

   useEffect(() => {
      if (!userId) {
         console.warn('🚨 userId is undefined, skipping fetch')
         return
      }

      fetchData(`/api/addresses?userId=${userId}`).then(result => {
         console.log('🔍 Debug: Result from API:', result)

         if (result?.addresses && Array.isArray(result.addresses)) {
            setAddresses(result.addresses)
         } else {
            console.error('🚫 API did not return an array for addresses:', result.addresses)
         }
      })
   }, [userId])

   const handleEditAddress = (address: Address) => {
      setEditingAddress(address)
      setIsEditing(true)
   }

   const handleUpdateAddress = async (updatedAddress: Address) => {
      if (!updatedAddress.id) {
         console.error('🚫 Missing address ID')
         toast.error('Address ID is missing')
         return
      }

      try {
         const response = await putData(`/api/addresses?id=${updatedAddress.id}`, updatedAddress, {
            Authorization: `Bearer ${session?.accessToken}`,
         })

         if (!response) {
            throw new Error('Failed to update address')
         }

         setAddresses(prevAddresses => {
            if (updatedAddress.isMain) {
               return prevAddresses.map(addr => ({
                  ...addr,
                  isMain: addr.id === updatedAddress.id, // Tylko jeden adres może być główny
                  ...(addr.id === updatedAddress.id ? updatedAddress : {}), // Aktualizujemy zmienione dane
               }))
            } else {
               return prevAddresses.map(addr => (addr.id === updatedAddress.id ? { ...addr, ...updatedAddress } : addr))
            }
         })

         setIsEditing(false)
         setEditingAddress(null)
         toast.success('Address updated successfully!')
      } catch (error) {
         console.error('❌ Error updating address:', error)
         toast.error('Failed to update address. Please try again.')
      }
   }

   const handleDeleteAddress = async (id: number) => {
      if (!session?.accessToken) {
         console.error('🚫 Missing access token')
         toast.error('Unauthorized: Please log in again')
         return
      }

      try {
         const response = await deleteData(
            `/api/addresses?id=${id}`,
            {},
            { Authorization: `Bearer ${session.accessToken}` },
         )

         if (!response) {
            throw new Error('Failed to delete address')
         }

         setAddresses(prev => prev.filter(addr => addr.id !== id))
         toast.success('Address deleted successfully!')
      } catch (error) {
         console.error('❌ Error deleting address:', error)
         toast.error('Failed to delete address. Please try again.')
      }
   }

   const sortedAddresses = useMemo(() => {
      return [...addresses].sort((a, b) => Number(b.isMain) - Number(a.isMain))
   }, [addresses])

   return (
      <div className='w-full max-w-full'>
         <h2 className='text-xl font-bold'>My Address</h2>
         {loading && <p>Loading addresses...</p>}
         {error && <p className='text-red-500'>Error: {error}</p>}
         {isEditing && editingAddress ? (
            <AddressForm
               onSubmit={updatedAddress =>
                  handleUpdateAddress({
                     ...updatedAddress,
                     id: updatedAddress.id as number,
                     isMain: updatedAddress.isMain as boolean,
                  })
               }
               initialData={editingAddress}
               onCancel={() => setIsEditing(false)}
            />
         ) : (
            <AddressList
               addresses={sortedAddresses}
               onEdit={handleEditAddress}
               onDelete={id => handleDeleteAddress(Number(id))}
               variant='list'
            />
         )}
      </div>
   )
}
