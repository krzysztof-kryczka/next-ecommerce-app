import { Button } from './ui/button'
import Text from '@/components/ui/text'
import AddressDialog from './AddressDialog'
import { MainAddressDisplayProps } from '@/types/MainAddressDisplayProps'
import { JSX } from 'react'
import LoadingIndicator from './ui/LoadingIndicator'
import ErrorMessage from './ui/ErrorMessage'

const MainAddressDisplay = ({ loading, error, addresses, onSelectAddress }: MainAddressDisplayProps): JSX.Element => {
   if (loading) return <LoadingIndicator />
   if (error) return <ErrorMessage sectionName='Address.' errorDetails={error} />
   if (addresses.length === 0) return <p>No addresses found.</p>

   const mainAddress = addresses.find(addr => addr.isMain)

   return mainAddress ? (
      <div className='flex flex-col'>
         <div className='flex flex-col gap-y-3 pb-10'>
            <div className='flex items-center justify-between gap-x-4 pb-3'>
               <div className='flex items-center gap-x-4'>
                  <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                     Address
                  </Text>
                  <Button variant='fill' size='XS' disabled>
                     Main Address
                  </Button>
               </div>
               <AddressDialog addresses={addresses} onSelectAddress={onSelectAddress} />
            </div>
            <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
               {mainAddress.addressLine}
            </Text>
         </div>
         <div className='flex justify-between'>
            <div className='flex flex-col gap-y-2'>
               <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                  Country
               </Text>
               <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                  {mainAddress.country}
               </Text>
            </div>
            <div className='flex flex-col gap-y-2'>
               <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                  Province
               </Text>
               <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                  {mainAddress.province}
               </Text>
            </div>
            <div className='flex flex-col gap-y-2'>
               <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                  City
               </Text>
               <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                  {mainAddress.city}
               </Text>
            </div>
            <div className='flex flex-col gap-y-2'>
               <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                  Postal Code
               </Text>
               <Text as='p' variant='textLmedium' className='text-[var(--color-neutral-900)]'>
                  {mainAddress.postalCode}
               </Text>
            </div>
         </div>
      </div>
   ) : (
      <Text as='p' variant='textLmedium' className='text-[var(--color-danger-50)]'>
         No main address found. Please add one main address!
      </Text>
   )
}

export default MainAddressDisplay
