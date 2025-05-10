import { Button } from '@/components/ui/button'
import Text from '@/components/ui/text'
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import MenuHorizontalIcon from './icons/MenuHorizontalIcon'
import { Separator } from './ui/separator'
import { AddressListProps } from '@/types/AddressListProps'
import { Address } from '@/types/Address'

const AddressList = ({
   addresses,
   onEdit,
   onDelete,
   onSelect,
   selectedAddress,
   variant = 'dialog',
}: AddressListProps) => {
   if (!addresses || addresses.length === 0) {
      return <p>No addresses found.</p>
   }

   const sortedAddresses = addresses

   return (
      <div className={`${variant === 'dialog' ? 'max-h-[600px] space-y-4 overflow-y-auto' : 'w-full space-y-4'}`}>
         {sortedAddresses.map(
            addr =>
               addr && (
                  <div
                     key={addr.id}
                     className={`flex items-center justify-between rounded-md border p-4 ${
                        addr?.isMain
                           ? 'border-[var(--color-primary-400)] bg-[var(--color-blazeOrange-900)]'
                           : selectedAddress?.id === addr?.id
                              ? 'border-blue-500 bg-blue-100'
                              : 'border-[var(--color-gray-800)] bg-[var(--color-base-gray)]'
                     }`}
                  >
                     {/* Kontener dla danych adresowych */}
                     <div className='flex w-full flex-col gap-y-6'>
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
                              {variant === 'dialog' && onSelect && !addr.isMain && (
                                 <Button
                                    variant='fill'
                                    size='XS'
                                    className='mt-2 ml-auto w-[83px]'
                                    onClick={() => onSelect(addr)}
                                    aria-label={`Select address ${addr.addressLine}`}
                                 >
                                    Select
                                 </Button>
                              )}
                           </div>
                           <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900)]'>
                              {addr.addressLine}
                           </Text>
                        </div>

                        <div className='flex w-full gap-x-6'>
                           {['country', 'province', 'city', 'postalCode'].map(field => (
                              <div key={field} className='flex flex-1 flex-col'>
                                 <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-100)]'>
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                 </Text>
                                 <Text as='p' variant='textMmedium' className='text-[var(--color-neutral-900)]'>
                                    {addr[field as keyof Address]}
                                 </Text>
                              </div>
                           ))}
                        </div>

                        {variant === 'dialog' && (
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button variant='text' className='w-[96px] gap-0 px-0'>
                                    Edit Address
                                 </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                 <AlertDialogTitle>Coming Soon!</AlertDialogTitle>
                                 <AlertDialogDescription>
                                    This feature will be available in future updates.
                                 </AlertDialogDescription>
                                 <AlertDialogAction>OK</AlertDialogAction>
                              </AlertDialogContent>
                           </AlertDialog>
                        )}
                     </div>

                     {/* Kontener dla trzech kropek */}
                     {variant === 'list' && onEdit && onDelete && (
                        <div className='flex items-center'>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant='ghost' className='w-2.5'>
                                    <MenuHorizontalIcon />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className='w-48 rounded-t-sm rounded-b-md border border-t-2 border-[var(--color-gray-800)] border-t-[var(--color-primary-400)] bg-[var(--color-base-gray)] p-2 shadow-xl'>
                                 <DropdownMenuItem
                                    className='flex items-center gap-x-2 rounded-md px-3 py-2 text-[var(--color-neutral-100)] hover:bg-[var(--color-gray-700)]'
                                    onClick={() => onEdit(addr)}
                                 >
                                    ✏️ <span>Edit</span>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className='flex cursor-not-allowed items-center gap-x-2 rounded-md px-3 py-2 text-[var(--color-neutral-100)] opacity-50'>
                                    🔗 <span>Share</span>
                                 </DropdownMenuItem>
                                 <Separator className='my-5 bg-[var(--color-gray-800)]' />
                                 <DropdownMenuItem
                                    className='flex items-center gap-x-2 rounded-md px-3 py-2 text-[var(--color-danger-400)] hover:bg-red-600 hover:text-white'
                                    onClick={() => onDelete(addr.id)}
                                 >
                                    🗑️ <span>Delete</span>
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                     )}
                  </div>
               ),
         )}
      </div>
   )
}

export default AddressList
