import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import Text from '@/components/ui/text'
import { Address } from '@/types/Address'
import { toast } from 'react-toastify'
import { Separator } from '@radix-ui/react-separator'

const AddressDialog = ({
   addresses,
   onSelectAddress,
}: {
   addresses: Address[]
   onSelectAddress: (address: Address) => void
}) => {
   const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
   const [open, setOpen] = useState(false)

   const sortedAddresses = [...addresses].sort((a, b) => Number(b.isMain) - Number(a.isMain))

   const handleChooseAddress = () => {
      if (selectedAddress) {
         onSelectAddress(selectedAddress)
         setOpen(false)
         toast.success(`🏠 Address selected: ${selectedAddress.addressLine}`)
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
            <div className='max-h-[600px] space-y-4 overflow-y-auto'>
               {sortedAddresses.map(addr => (
                  <div
                     key={addr.id}
                     className={`rounded-md border p-4 ${
                        addr.isMain
                           ? 'border-[var(--color-primary-400)] bg-[var(--color-blazeOrange-900)]'
                           : selectedAddress?.id === addr.id
                             ? 'border-blue-500 bg-blue-100'
                             : 'border-[var(--color-gray-800)] bg-[var(--color-base-gray)]'
                     }`}
                  >
                     <div className='flex flex-col gap-y-8'>
                        <div className='flex flex-col gap-y-3'>
                           <div className='flex items-center gap-x-4'>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                                 Address
                              </Text>
                              {addr.isMain && (
                                 <Text
                                    as='span'
                                    variant='textSmedium'
                                    className='rounded-md bg-[var(--color-primary-700)] px-2.5 py-1.5 text-[var(--color-primary-100)]'
                                 >
                                    Main Address
                                 </Text>
                              )}
                              {!addr.isMain && (
                                 <Button
                                    variant='fill'
                                    size='XS'
                                    className='mt-2 ml-auto w-[83px]'
                                    onClick={() => setSelectedAddress(addr)}
                                 >
                                    Select
                                 </Button>
                              )}
                           </div>
                           <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900)]'>
                              {addr.addressLine}
                           </Text>
                        </div>

                        <div className='flex items-center justify-between'>
                           <div className='flex flex-col gap-y-2'>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                                 Country
                              </Text>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900)]'>
                                 {addr.country}
                              </Text>
                           </div>
                           <div className='flex flex-col gap-y-2'>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                                 Province
                              </Text>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900)]'>
                                 {addr.province}
                              </Text>
                           </div>
                           <div className='flex flex-col gap-y-2'>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                                 City
                              </Text>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900)]'>
                                 {addr.city}
                              </Text>
                           </div>
                           <div className='flex flex-col gap-y-2'>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                                 Postal Code
                              </Text>
                              <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900)]'>
                                 {addr.postalCode}
                              </Text>
                           </div>
                        </div>
                        <Button variant='text' size='XS' className='w-[98px] px-0'>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Text as='span' variant='textMmedium' className='text-[var(--color-primary-400)]'>
                                    Edit Address
                                 </Text>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                 <AlertDialogTitle>Coming Soon!</AlertDialogTitle>
                                 <AlertDialogDescription>
                                    This feature will be available in future updates. Stay tuned for enhancements!
                                 </AlertDialogDescription>
                                 <AlertDialogAction>OK</AlertDialogAction>
                              </AlertDialogContent>
                           </AlertDialog>
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
            <Button variant='fill' size='M' className='mt-4 w-full' onClick={handleChooseAddress}>
               Choose Address
            </Button>
         </DialogContent>
      </Dialog>
   )
}

export default AddressDialog
