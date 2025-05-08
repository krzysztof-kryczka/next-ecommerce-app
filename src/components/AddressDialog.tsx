'use client'

import { useMemo, useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@radix-ui/react-separator'
import { Button } from '@/components/ui/button'
import { Address } from '@/types/Address'
import { toast } from 'react-toastify'
import AddressList from './AddressList'

const AddressDialog = ({
   addresses,
   onSelectAddress,
}: {
   addresses: Address[]
   onSelectAddress: (address: Address) => void
}) => {
   const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
   const [open, setOpen] = useState(false)

   const sortedAddresses = useMemo(() => {
      return [...addresses].sort((a, b) => Number(b.isMain) - Number(a.isMain))
   }, [addresses])

   const handleChooseAddress = () => {
      if (selectedAddress) {
         onSelectAddress(selectedAddress)
         setOpen(false)
         toast.success(`Address selected: ${selectedAddress.addressLine}`)
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         {addresses.length > 0 && (
            <DialogTrigger asChild>
               <Button variant='stroke' size='XS' onClick={() => setOpen(true)}>
                  Change Address
               </Button>
            </DialogTrigger>
         )}
         <DialogContent className='max-h-[800px] max-w-md overflow-y-auto rounded-lg bg-black/100 p-6 shadow-lg backdrop-blur-2xl'>
            <DialogHeader>
               <DialogTitle className='text-2xl leading-9 font-medium tracking-[-0.01em] text-[var(--color-neutral-900)]'>
                  Address
               </DialogTitle>
            </DialogHeader>
            <Separator className='bg-[var(--color-gray-800)]' />

            {/* Lista adresów z podświetleniem wybranego */}
            <AddressList
               addresses={sortedAddresses}
               onSelect={setSelectedAddress}
               selectedAddress={selectedAddress}
               variant='dialog'
            />

            <Button variant='fill' size='M' className='mt-4 w-full' onClick={handleChooseAddress}>
               Choose Address
            </Button>
         </DialogContent>
      </Dialog>
   )
}

export default AddressDialog
