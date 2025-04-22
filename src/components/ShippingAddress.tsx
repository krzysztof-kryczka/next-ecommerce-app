import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { Address } from '@/types/Address'
import { Button } from './ui/button'

const ShippingAddress = ({ onMainAddressSelect }: { onMainAddressSelect: (address: Address) => void }) => {
   const { data: session } = useSession()
   const userId = session?.user?.id
   const [addresses, setAddresses] = useState<Address[]>([])
   const [error, setError] = useState<string | null>(null)
   const [loading, setLoading] = useState<boolean>(true)

   useEffect(() => {
      const fetchAddresses = async () => {
         try {
            if (!session || !session.user || !session.token) {
               setError('User is not logged in or token is missing')
               return
            }

            const response = await fetch(`/api/address?userId=${session.user.id}`, {
               method: 'GET',
               headers: {
                  Authorization: `Bearer ${session.token}`,
               },
            })

            if (!response.ok) throw new Error(`HTTP Error ${response.status}`)

            const data = await response.json()
            setAddresses(data.addresses)

            const mainAddress = data.addresses.find((address: Address) => address.isMain)
            if (mainAddress) {
               onMainAddressSelect(mainAddress)
            }
         } catch (err: unknown) {
            if (err instanceof Error) {
               setError(err.message || 'An unknown error occurred')
            }
         } finally {
            setLoading(false)
         }
      }

      if (userId) {
         fetchAddresses()
      }
   }, [userId, session])

   const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const newAddress: Address = {
         id: Date.now(),
         country: formData.get('country') as string,
         province: formData.get('province') as string,
         city: formData.get('city') as string,
         postalCode: formData.get('postalCode') as string,
         addressLine: formData.get('address') as string,
         isMain: formData.get('mainAddress') === 'on',
      }

      try {
         if (!session || !session.token) {
            setError('User is not logged in or token is missing')
            return
         }

         const response = await fetch(`/api/address?userId=${userId}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify(newAddress),
         })

         if (!response.ok) throw new Error(`HTTP Error ${response.status}`)

         const data = await response.json()

         if (newAddress.isMain) {
            setAddresses(prev => prev.map(addr => ({ ...addr, isMain: false })))
            onMainAddressSelect(data.address)
         }
         setAddresses(prev => [...prev, data.address])
      } catch (err: unknown) {
         if (err instanceof Error) {
            setError(err.message || 'An unknown error occurred')
         }
      }
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
                  {loading ? (
                     <p>Loading addresses...</p>
                  ) : error ? (
                     <p className='text-red-500'>{error}</p>
                  ) : addresses.length > 0 ? (
                     <>
                        {addresses.map((address: any) => (
                           <div className='flex flex-col' key={address.id}>
                              {address.isMain && (
                                 <div className='flex items-center gap-x-4 pb-3'>
                                    <p className='text-base font-medium text-[var(--color-neutral-100)]'>Address</p>
                                    <Button variant='fill' size='XS' disabled className=''>
                                       Main Address
                                    </Button>
                                 </div>
                              )}

                              <p className='pb-8 text-lg font-medium text-[var(--color-neutral-900)]'>
                                 {address.addressLine}
                              </p>
                              <div className='flex gap-x-[177.3px]'>
                                 <div className='flex flex-col gap-y-2'>
                                    <p className='text-base font-medium text-[var(--color-neutral-100)]'>Country:</p>
                                    <p className='text-lg font-medium text-[var(--color-neutral-900)]'>
                                       {address.country}
                                    </p>
                                 </div>
                                 <div className='flex flex-col gap-y-2'>
                                    <p className='text-base font-medium text-[var(--color-neutral-100)]'>Province:</p>
                                    <p className='text-lg font-medium text-[var(--color-neutral-900)]'>
                                       {address.province}
                                    </p>
                                 </div>
                                 <div className='flex flex-col gap-y-2'>
                                    <p className='text-base font-medium text-[var(--color-neutral-100)]'>City:</p>
                                    <p className='text-lg font-medium text-[var(--color-neutral-900)]'>
                                       {address.city}
                                    </p>
                                 </div>
                                 <div className='flex flex-col gap-y-2'>
                                    <p className='text-base font-medium text-[var(--color-neutral-100)]'>
                                       Postal Code:
                                    </p>
                                    <p className='text-lg font-medium text-[var(--color-neutral-900)]'>
                                       {address.postalCode}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </>
                  ) : (
                     <p>No addresses found.</p>
                  )}
               </CardContent>
            </TabsContent>

            <TabsContent value='new'>
               <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Provide your shipping information below:</CardDescription>
               </CardHeader>
               <CardContent>
                  <form className='flex flex-col gap-y-4' onSubmit={handleAddAddress}>
                     <input
                        type='text'
                        name='country'
                        placeholder='Country'
                        className='rounded-lg border border-gray-300 p-2'
                     />
                     <input
                        type='text'
                        name='province'
                        placeholder='Province'
                        className='rounded-lg border border-gray-300 p-2'
                     />
                     <input
                        type='text'
                        name='city'
                        placeholder='City'
                        className='rounded-lg border border-gray-300 p-2'
                     />
                     <input
                        type='text'
                        name='postalCode'
                        placeholder='Postal Code'
                        className='rounded-lg border border-gray-300 p-2'
                     />
                     <input
                        type='text'
                        name='address'
                        placeholder='Complete Address'
                        className='rounded-lg border border-gray-300 p-2'
                     />
                     <label className='flex items-center'>
                        <input type='checkbox' name='mainAddress' className='mr-2' /> Make this my main address
                     </label>
                     <button type='submit' className='mt-2 rounded bg-blue-500 p-2 text-white'>
                        Add Address
                     </button>
                  </form>
               </CardContent>
            </TabsContent>
         </Tabs>
      </Card>
   )
}

export default ShippingAddress
