import { JSX, useCallback, useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { Address } from '@/types/Address'
import useFetch from '@/hooks/useFetch'
import { toast } from 'react-toastify'
import { AddressFormData } from '@/schema/addressSchema'
import AddressForm from './AddressForm'
import MainAddressDisplay from './MainAddressDisplay'

const ShippingAddress = ({ onMainAddressSelect }: { onMainAddressSelect: (address: Address) => void }): JSX.Element => {
   const [addresses, setAddresses] = useState<Address[]>([])
   const { data: session } = useSession()
   const userId = session?.user?.id

   const { error, loading, fetchData, postData } = useFetch<{ success: boolean; addresses: Address[] }>(
      userId ? `/api/addresses?userId=${userId}` : null,
   )

   useEffect(() => {
      if (addresses.length === 0) return
      const defaultMainAddress = addresses.find(address => address.isMain)
      if (defaultMainAddress) {
         onMainAddressSelect(defaultMainAddress)
      }
   }, [addresses, onMainAddressSelect])

   const getAddresses = useCallback(async () => {
      if (!userId) return
      const result = await fetchData()
      if (Array.isArray(result)) {
         console.error('❌ Unexpected array format:', result)
      } else if (result?.success && result?.addresses) {
         setAddresses(result.addresses)
      }
   }, [userId, fetchData])

   useEffect(() => {
      getAddresses()
   }, [getAddresses])

   const handleAddAddress = async (data: AddressFormData) => {
      const response = await postData('/api/addresses', { ...data, userId })

      if (response?.success) {
         const newAddress: Address = {
            ...data,
            id: response.addresses?.[response.addresses.length - 1]?.id || Date.now(),
            isMain: !!data.isMain,
         }

         setAddresses(prevAddresses => {
            if (newAddress.isMain) {
               return prevAddresses
                  .map(addr => ({ ...addr, isMain: addr.isMain ?? false }))
                  .concat({
                     ...newAddress,
                     isMain: newAddress.isMain ?? false,
                  })
            } else {
               return [...prevAddresses, newAddress]
            }
         })

         toast.success('Address added successfully!')
      } else {
         toast.error('❌ Failed to add address. Please try again.')
      }
   }

   const handleSelectAddress = (address: Address) => {
      onMainAddressSelect(address) // Przekazanie adresu do CheckoutPage
   }

   return (
      <Card className='w-full rounded-md border border-[var(--color-gray-800)] bg-[var(--color-base-gray)] p-6'>
         <Tabs defaultValue='existing' className='w-full'>
            <TabsList className='flex w-full'>
               <TabsTrigger
                  value='existing'
                  className='flex-1 rounded-none border-b-[var(--color-gray-800))] py-2 text-center text-base font-medium text-[var(--color-neutral-300)] hover:text-[var(--color-primary)] data-[state=active]:border-b-[var(--color-blazeOrange-600))] data-[state=active]:bg-transparent data-[state=active]:text-[var(--color-blazeOrange-600)]'
               >
                  Existing Address
               </TabsTrigger>
               <TabsTrigger
                  value='new'
                  className='flex-1 rounded-none border-b-[var(--color-gray-800))] py-2 text-center text-base font-medium text-[var(--color-neutral-300)] hover:text-[var(--color-primary)] data-[state=active]:border-b-[var(--color-blazeOrange-600))] data-[state=active]:bg-transparent data-[state=active]:text-[var(--color-blazeOrange-600)]'
               >
                  New Address
               </TabsTrigger>
            </TabsList>

            <TabsContent value='existing'>
               <CardContent className='p-0 pt-8'>
                  <MainAddressDisplay
                     loading={loading}
                     error={error}
                     addresses={addresses}
                     onSelectAddress={handleSelectAddress}
                  />
               </CardContent>
            </TabsContent>

            <TabsContent value='new'>
               <CardContent className='px-0 pt-8'>
                  <AddressForm onSubmit={handleAddAddress} />
               </CardContent>
            </TabsContent>
         </Tabs>
      </Card>
   )
}

export default ShippingAddress
